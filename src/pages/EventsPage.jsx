import { useState, useMemo, useEffect } from 'react';
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { EventCard } from '../components/EventCard';
import UpdateFilter from '../components/UpdateFilter';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

// SearchBar Component
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

// Main EventsPage Component
export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', date: '' });

  // 🔄 Real-time Firestore listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    });

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !filters.category || event.category?.toLowerCase() === filters.category.toLowerCase();
      const matchesLocation = !filters.location || event.location?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [events, searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Events in Your City</h1>

      <div className="flex flex-col lg:flex-row gap-8">
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

        <div className="lg:w-3/4">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
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
