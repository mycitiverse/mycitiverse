import { useState, useMemo, useEffect } from "react";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { EventCard } from "../components/EventCard";
import UpdateFilter from "../components/UpdateFilter";
import { db } from "../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import RecommendedEvents from "../components/RecommendedEvents";

// 🔍 SearchBar Component
function SearchBar({ onSearch, placeholder = "Search...", className = "" }) {
  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)}
      className={className}
    />
  );
}

// 🌆 Main EventsPage Component
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

  // 📦 Load all events
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Load user data and calculate recommendations
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const viewed = data.viewedCategories || [];

        // 📊 Count category frequency
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

  // 🧠 Filtered events based on search & filters
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
        event.location?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [events, searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Events in Your City</h1>

      {/* 🎯 Recommended Events Section */}
      {Array.isArray(recommendedEvents) && recommendedEvents.length > 0 && (
        <RecommendedEvents events={recommendedEvents} />
      )}

      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        {/* 🔍 Filters Panel */}
        <div className="lg:w-1/4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search events..."
            className="mb-6"
          />
          <Card className="w-full">
            <CardHeader>
              <h2 className="text-lg font-semibold">Advanced Filters</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <UpdateFilter onFilterChange={setFilters} />
            </CardContent>
          </Card>
        </div>

        {/* 🎫 Filtered Event Results */}
        <div className="lg:w-3/4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  category={event.category}
                  imageUrl={event.imageUrl}
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
    </div>
  );
}
