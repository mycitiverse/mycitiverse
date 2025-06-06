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

  // Booking form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [personName, setPersonName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [attendees, setAttendees] = useState("");
  const [purpose, setPurpose] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");
  const [notes, setNotes] = useState("");

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

    if (purpose === "Others" && !otherPurpose.trim()) {
      alert("Please specify the purpose of booking.");
      return;
    }

    try {
      await addDoc(collection(db, "hallBookings"), {
        hallId: id,
        hallName: hall.name,
        userEmail: currentUser.email,
        date,
        time,
        personName,
        contactInfo,
        attendees: Number(attendees),
        purpose: purpose === "Others" ? otherPurpose : purpose,
        notes,
        totalAmount: hall.pricePerPlate * Number(attendees),
        createdAt: new Date(),
      });
      alert("Booking confirmed!");
      navigate("/community-hall");
    } catch (error) {
      console.error("Error booking hall:", error);
      alert("Failed to book. Try again.");
    }
  };

  // Calculate total cost live
  const totalCost =
    hall && attendees && !isNaN(attendees)
      ? hall.pricePerPlate * Number(attendees)
      : 0;

  if (!hall) return <div className="p-4">Loading hall details...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Book: {hall.name}</h2>
      <p className="text-gray-700 mb-2">Location: {hall.location}</p>
      <p className="text-gray-500 mb-4">
        Capacity: {hall.capacity} | Price per plate: ₹{hall.pricePerPlate}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name of Person:</label>
          <input
            type="text"
            required
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Information:</label>
          <input
            type="tel"
            required
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Phone number or email"
          />
        </div>

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

        <div>
          <label className="block mb-1 font-medium">Number of Attendees:</label>
          <input
            type="number"
            required
            min="1"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter number of attendees"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Purpose of Booking:</label>
          <select
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>
              Select purpose
            </option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Meeting">Meeting</option>
            <option value="Seminar">Seminar</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {purpose === "Others" && (
          <div>
            <label className="block mb-1 font-medium">Please specify:</label>
            <input
              type="text"
              value={otherPurpose}
              onChange={(e) => setOtherPurpose(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter other purpose"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Additional Notes / Requests:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Any additional info"
            rows={3}
          />
        </div>
        {/* Total Amount Calculator */}
        <div className="flex items-center justify-between mt-4">
        <div className="text-lg font-bold text-red-600">
         Total Amount: ₹{totalCost}
       </div>
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
