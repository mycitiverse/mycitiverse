// src/pages/EventList.jsx
import { useEffect, useState } from "react";
import { EventCard } from "../components/EventCard";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "" || event.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // sort by date ascending

  return (
    <div className="p-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-1/4 p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="Music">Music</option>
          <option value="Food">Food</option>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Art">Art</option>
          <option value="Education">Education</option>
          {/* Add more if needed */}
        </select>
      </div>

      {/* Event Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
              location={event.location}
              description={event.description}
              thumbnailUrl={event.thumbnailUrl}
              category={event.category}
              price={event.price}
              onDelete={null} // add handler if needed
              isUserEvent={false}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No events found.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventList;
