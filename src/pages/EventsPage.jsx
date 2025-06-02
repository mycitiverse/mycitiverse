import { useState, useMemo, useEffect } from 'react';
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { getUserEvents, deleteUserEvent } from '../utils/storage';
import { EventCard } from '../components/EventCard';
import UpdateFilter from '../components/UpdateFilter';

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
  const [userEvents, setUserEvents] = useState([]);
  const [filters, setFilters] = useState({ category: '', location: '', date: '' });

  const dummyEvents = useMemo(() => [
    {
      id: '1',
      title: 'Jazz Night',
      description: 'An evening of smooth jazz with local artists',
      date: '2023-11-15',
      location: 'City Jazz Club',
      category: 'Music',
      imageUrl: ''
    },
    {
      id: '2',
      title: 'Marathon',
      description: 'Annual city marathon through downtown',
      date: '2023-11-20',
      location: 'Central Park',
      category: 'Sports',
      imageUrl: ''
    },
    {
      id: '3',
      title: 'Photography Workshop',
      description: 'Learn professional photography techniques',
      date: '2023-11-25',
      location: 'Arts Center',
      category: 'Workshops',
      imageUrl: ''
    },
    {
      id: '4',
      title: 'Food Festival',
      description: 'Taste cuisine from around the world',
      date: '2023-12-02',
      location: 'Downtown Square',
      category: 'Festivals',
      imageUrl: ''
    },
    {
      id: '5',
      title: 'Rock Concert',
      description: 'Popular rock bands performing live',
      date: '2023-12-10',
      location: 'Arena Stadium',
      category: 'Music',
      imageUrl: ''
    }
  ], []);

  // Load user events on mount
  useEffect(() => {
    const storedEvents = Array.isArray(getUserEvents()) ? getUserEvents() : [];
    setUserEvents(storedEvents);
  }, []);

  const handleDelete = (id) => {
    deleteUserEvent(id);
    const updatedEvents = getUserEvents();
    setUserEvents(updatedEvents);
  };

  const filteredEvents = useMemo(() => {
    const allEvents = [
      ...userEvents.map(e => ({ ...e, isUserEvent: true })),
      ...dummyEvents
    ];

    return allEvents.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !filters.category || event.category.toLowerCase() === filters.category.toLowerCase();
      const matchesLocation = !filters.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDate = !filters.date || event.date === filters.date;

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [userEvents, dummyEvents, searchQuery, filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
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
                  key={event.id || `${event.title}-${event.date}`} 
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  location={event.location}
                  description={event.description}
                  category={event.category}
                  imageUrl={event.imageUrl}
                  isUserEvent={event.isUserEvent}
                  onDelete={handleDelete}
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
