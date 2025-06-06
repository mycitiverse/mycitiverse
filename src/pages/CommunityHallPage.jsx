import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CommunityHallPage = () => {
  const [halls, setHalls] = useState([]);

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "communityHalls"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHalls(data);
      } catch (error) {
        console.error("Error fetching community halls:", error);
      }
    };

    fetchHalls();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Book a Community Hall</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map(hall => (
          <div key={hall.id} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{hall.name}</h2>
            <p className="text-gray-700 mb-2">{hall.location}</p>
            <p className="text-gray-500 mb-4">Capacity: {hall.capacity}</p>
            <Link
              to={`/book-hall/${hall.id}`}
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHallPage;
