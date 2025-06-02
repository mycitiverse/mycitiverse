// src/pages/EventList.jsx
import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const EventList = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          title={event.title}
          date={event.date}
          location={event.location}
          description={event.description}
          imageUrl={event.imageUrl}
          onDelete={null} // add delete handler if needed
        />
      ))}
    </div>
  );
};

export default EventList;
