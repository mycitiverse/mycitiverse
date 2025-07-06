import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const BookEventPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [personName, setPersonName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [tickets, setTickets] = useState("");
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState({ personName: "", contactInfo: "", tickets: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such event!");
        }
      } catch (error) {
        console.error("Error getting event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event) return alert("Event data is still loading. Try again.");
    if (Number(tickets) <= 0) return alert("Please enter valid number of tickets.");
    if (Number(tickets) > event.maxTickets) return alert(`Max limit is ${event.maxTickets} tickets.`);

    try {
      const bookingsRef = collection(db, "eventBookings");
      const q = query(
        bookingsRef,
        where("eventId", "==", id),
        where("userId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return alert("You have already booked this event.");
      }

      const bookingRef = await addDoc(bookingsRef, {
        eventId: id,
        eventName: event.title,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        personName: personName.trim(),
        contactInfo: contactInfo.trim(),
        tickets: Number(tickets),
        notes,
        totalAmount: event.price * Number(tickets),
        paymentStatus: "Paid",
        status: "Confirmed",
        createdAt: new Date(),
      });

      // ✅ Navigate to confirmation page
      navigate(`/booking/confirmation/event/${bookingRef.id}`);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Try again.");
    }
  };

  const totalCost =
    event && tickets && !isNaN(tickets)
      ? event.price * Number(tickets)
      : 0;

  const isFormValid =
    personName.trim() !== "" &&
    contactInfo.trim().length === 10 &&
    Number(tickets) > 0 &&
    Number(tickets) <= event?.maxSeats &&
    !Object.values(errors).some((e) => e);

  if (!event) return <div className="p-4">Loading event details...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded-xl shadow">
      <button
        onClick={() => navigate(`/events/${id}`)}
        className="mb-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
      >
        ← Back to Event Page
      </button>

      <h2 className="text-center font-bold text-4xl mb-5">🎟️ Book: <span className="text-red-600">{event.title}</span></h2>

      {event.thumbnailUrl && (
        <img
          src={event.thumbnailUrl}
          alt={`${event.title} thumbnail`}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <p className="text-gray-700 mb-2">📍 Location: <b>{event.location}</b></p>
      <p className="text-gray-700 mb-2">
        🗓️ Date: <b>{event.date}</b> | ⏰ Time: <b>{event.time}</b> | 🏷️ Category: <b>{event.category}</b></p>
      <p className="text-gray-700 mb-5">
        🎫 Price/Ticket: <span className="text-green-600 font-bold">₹{event.price}</span> | 🎟️ Max: <b>{event.maxSeats}</b>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name of Person: <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={personName}
            onChange={(e) => {
              const value = e.target.value;
              if (/^[a-zA-Z\s]*$/.test(value)) {
                setPersonName(value);
                setErrors((prev) => ({ ...prev, personName: "" }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  personName: "Only alphabets and spaces are allowed.",
                }));
              }
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Your full name"
          />
          {errors.personName && <p className="text-red-500 text-sm mt-1">{errors.personName}</p>}
        </div>

        {/* Contact */}
        <div>
          <label className="block mb-1 font-medium">Contact Information: <span className="text-red-500">*</span></label>
          <input
            type="tel"
            required
            value={contactInfo}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setContactInfo(value);
                if (value.length === 10) {
                  setErrors((prev) => ({ ...prev, contactInfo: "" }));
                } else {
                  setErrors((prev) => ({
                    ...prev,
                    contactInfo: "Phone number must be 10 digits.",
                  }));
                }
              } else {
                setErrors((prev) => ({
                  ...prev,
                  contactInfo: "Only numbers are allowed.",
                }));
              }
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Phone number"
          />
          {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
        </div>

        {/* Tickets */}
        <div>
          <label className="block mb-1 font-medium">Number of Tickets: <span className="text-red-500">*</span></label>
          <input
            type="number"
            required
            min="1"
            max={event.maxSeats}
            value={tickets}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) && Number(value) > 0 && Number(value) <= event.maxSeats) {
                setTickets(value);
                setErrors((prev) => ({ ...prev, tickets: "" }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  tickets: `Please enter a valid number between 1 and ${event.maxSeats}.`,
                }));
              }
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter number of tickets"
          />
          {errors.tickets && <p className="text-red-500 text-sm mt-1">{errors.tickets}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-1 font-medium">Notes / Requests:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Optional"
          />
        </div>

        {/* Total Cost */}
        <div className="text-green-600 font-bold text-lg">
          Total: ₹{totalCost}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-4 py-2 rounded text-white ${
            isFormValid ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookEventPage;
