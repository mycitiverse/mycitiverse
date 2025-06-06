import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Button from "../components/ui/Button"; // import Button component

const CommunityHallDetails = () => {
  const { id } = useParams();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHallDetails = async () => {
      try {
        const docRef = doc(db, "communityHalls", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHall(docSnap.data());
        } else {
          console.error("No such hall!");
        }
      } catch (error) {
        console.error("Error fetching hall details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHallDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!hall) {
    return <div className="text-center py-10">Hall not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        ← Back to List
      </Button>

      {/* Title and Info */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{hall.name}</h1>
      <p className="text-gray-600 mb-1 text-lg">📍 {hall.location}</p>
      <p className="text-gray-500 mb-6">
        Capacity: <strong>{hall.capacity}</strong> | ₹ {hall.pricePerPlate} per plate | Status:{" "}
        <span className={hall.availability === "Available" ? "text-green-600" : "text-red-600"}>
          {hall.availability}
        </span>
      </p>

      {/* Image Gallery */}
      {hall.images && hall.images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {hall.images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${hall.name} - view ${index + 1}`}
              className="rounded-lg shadow-md w-full h-60 object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="mb-8 bg-gray-200 text-center text-gray-600 py-10 rounded-lg">
          No images available
        </div>
      )}

      {/* Book Now Button */}
      <button
        onClick={() => navigate(`/book-hall/${id}`)}
        className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md transition"
      >
        📅 Book Community Hall
      </button>
    </div>
  );
};

export default CommunityHallDetails;
