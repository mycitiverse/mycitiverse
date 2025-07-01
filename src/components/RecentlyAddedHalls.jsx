import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const RecentlyAddedHalls = () => {
  const [recentHalls, setRecentHalls] = useState([]);

  useEffect(() => {
    const fetchRecentHalls = async () => {
      const q = query(
        collection(db, "communityHalls"),
        orderBy("createdAt", "desc"),
        limit(4)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentHalls(data);
    };
    fetchRecentHalls();
  }, []);

  return (
    <section className="px-6 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Recently Added Community Halls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentHalls.length > 0 ? (
            recentHalls.map((hall) => (
              <Link
                to={`/community-hall/${hall.id}`}
                key={hall.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition block overflow-hidden"
              >
                {hall.thumbnail || (hall.images?.length > 0) ? (
                  <img
                    src={hall.thumbnail || hall.images[0]}
                    alt={hall.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 italic">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{hall.name}</h3>
                  <p className="text-gray-600 text-sm">📍 {hall.location}</p>
                  <p className="text-sm">👥 Capacity: {hall.capacity}</p>
                  <p className="text-sm">💰 ₹{hall.pricePerPlate}/plate</p>
                  <p
                    className={`mt-1 font-semibold ${
                      hall.availability === "Available"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {hall.availability}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No community halls added yet.
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/community-hall"
            className="inline-block mt-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition"
          >
            View All Community Halls
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentlyAddedHalls;
