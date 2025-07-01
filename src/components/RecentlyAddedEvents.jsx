import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function RecentlyAddedEvents() {
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          orderBy("createdAt", "desc"),
          limit(4)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentEvents(data);
      } catch (error) {
        console.error("Error fetching recent events:", error);
      }
    };

    fetchRecentEvents();
  }, []);

  return (
    <section className="px-6 py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Recently Added Events
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentEvents.length > 0 ? (
            recentEvents.map((event) => (
              <Link
                to={`/event/${event.id}`}
                key={event.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition block overflow-hidden"
              >
                {event.thumbnailUrl ? (
                  <img
                    src={event.thumbnailUrl}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 italic">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">📍 {event.location}</p>
                  <p className="text-sm text-gray-600">📅 {event.date}</p>
                  <p className="text-sm text-gray-600">💰 ₹{event.price}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No recent events available.
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/events"
            className="inline-block mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition"
          >
            View All Events
          </Link>
        </div>
      </div>
    </section>
  );
}
