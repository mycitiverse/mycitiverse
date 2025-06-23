import { useState, useMemo, useEffect } from "react";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { EventCard } from "../components/EventCard";
import { db } from "../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import RecommendedEvents from "../components/RecommendedEvents";

// 🔍 SearchBar Component with letters-only restriction
function SearchBar({ onSearch, placeholder = "Search...", className = "", value }) {
  const handleChange = (e) => {
    const clean = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    onSearch(clean);
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    if (!/^[a-zA-Z\s]$/.test(key) && key.length === 1) {
      e.preventDefault();
    }
  };

  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={value}
      className={className}
    />
  );
}

export default function EventsPage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
  });
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  // 📦 Load all events
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);

      const categories = [...new Set(eventsData.map((e) => e.category).filter(Boolean))];
      const locations = [...new Set(eventsData.map((e) => e.location).filter(Boolean))];
      setAvailableCategories(categories);
      setAvailableLocations(locations);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Load user preferences and recommend events
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const viewed = data.viewedCategories || [];

        const count = {};
        viewed.forEach((cat) => {
          count[cat] = (count[cat] || 0) + 1;
        });

        const topCategories = Object.entries(count)
          .sort((a, b) => b[1] - a[1])
          .map(([cat]) => cat);

        const recommendations = events.filter((event) =>
          topCategories.includes(event.category)
        );

        setRecommendedEvents(recommendations.slice(0, 6));
      }
    };

    fetchUserData();
  }, [currentUser, events]);

  // 🧠 Filtered Events List
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filters.category ||
        event.category?.toLowerCase() === filters.category.toLowerCase();

      const matchesLocation =
        !filters.location ||
        event.location?.toLowerCase() === filters.location.toLowerCase();

      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [events, searchQuery, filters]);

  // 🔄 Reset handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilters({ category: "", location: "", date: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Events in Your City</h1>

      {/* 🎯 Recommended Events Section */}
      {Array.isArray(recommendedEvents) && recommendedEvents.length > 0 && (
        <RecommendedEvents events={recommendedEvents} />
      )}

      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        {/* 🔍 Filters Panel */}
        <div className="lg:w-1/4">
        <label className="block font-medium mb-1">Search</label>
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search events..."
            className="mb-6"
            value={searchQuery}
          />

          {/* Filters - Category */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Category</label>
            <select
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              value={filters.category}
            >
              <option value="">All Categories</option>
              {availableCategories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Location and Date Filters */}
          <Card className="w-full mt-2">
            <CardHeader>
              <h2 className="text-lg font-semibold">More Filters</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Location Dropdown */}
              <div>
                <label className="block font-medium mb-1">Location</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  value={filters.location}
                >
                  <option value="">All Locations</option>
                  {availableLocations.map((loc, idx) => (
                    <option key={idx} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter - Today or Future Only */}
              <div>
                <label className="block font-medium mb-1">Date</label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={filters.date}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="mt-4 w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded shadow"
          >
            Reset Filters
          </button>
        </div>

        {/* 🎫 Events List */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  category={event.category}
                  thumbnailUrl={event.thumbnailUrl}
                  price={event.price}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-500">
                No events match your search criteria
              </h3>
              <p className="text-gray-400 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
  );
}
