// components/UserEventsList.jsx

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const UserEventsList = () => {
  const [user] = useAuthState(auth);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "events"), where("createdBy", "==", user.email));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserEvents(eventsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {userEvents.length > 0 ? (
        userEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
          >
            <img
              src={event.imageUrl || "https://via.placeholder.com/300"}
              alt={event.title}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600 text-sm">
              {event.date} at {event.time}
            </p>
            <p className="text-gray-700 mt-2">{event.description}</p>
            <button
              onClick={() => handleDelete(event.id)}
              className="mt-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-3">
          No user events found.
        </p>
      )}
    </div>
  );
};

export default UserEventsList;
