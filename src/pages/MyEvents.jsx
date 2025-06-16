import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { EventCard } from "../components/EventCard";

const MyEvents = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, "events"),
          where("createdBy", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const myEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(myEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoading(false);
    };

    fetchMyEvents();
  }, [currentUser]);

  if (loading) return <div className="text-center py-10">Loading your events...</div>;
  if (!events.length) return <div className="text-center py-10">You haven’t created any events yet.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">My Created Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            description={event.description}
            category={event.category}
            imageUrl={event.imageUrl}
            price={event.price}
            isUserEvent={true} // Optional: use this to enable delete button
            onDelete={(id) => {
              setEvents(events.filter(e => e.id !== id));
              // Also handle deletion in Firestore if needed
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
