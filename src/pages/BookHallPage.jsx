import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const BookHallPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const docRef = doc(db, "communityHalls", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHall({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such hall!");
        }
      } catch (error) {
        console.error("Error getting hall:", error);
      }
    };

    fetchHall();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "hallBookings"), {
        hallId: id,
        hallName: hall.name,
        userEmail: currentUser.email,
        date,
        time,
        createdAt: new Date(),
      });
      alert("Booking confirmed!");
      navigate("/community-halls");
    } catch (error) {
      console.error("Error booking hall:", error);
      alert("Failed to book. Try again.");
    }
  };

  if (!hall) return <div className="p-4">Loading hall details...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Book: {hall.name}</h2>
      <p className="text-gray-700 mb-2">Location: {hall.location}</p>
      <p className="text-gray-500 mb-4">Capacity: {hall.capacity}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Date:</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Time:</label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookHallPage;
