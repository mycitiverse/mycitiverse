import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const MyHallBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, "hallBookings"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const userBookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
      setLoading(false);
    };

    fetchBookings();
  }, [currentUser]);

  const cancelBooking = async (bookingId) => {
    try {
      await updateDoc(doc(db, "hallBookings", bookingId), {
        status: "Cancelled",
      });
      alert("Booking cancelled successfully.");

      // Re-fetch bookings
      const q = query(
        collection(db, "hallBookings"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const updatedBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  if (loading) return <div className="p-4">Loading your bookings...</div>;
  if (!bookings.length) return <div className="p-4">No bookings found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Hall Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border p-4 rounded-xl shadow-md bg-white"
          >
            <h3 className="text-xl font-bold mb-2">{booking.hallName || "Hall"}</h3>
            <p>📅 Date: {booking.date || "N/A"}</p>
            <p>⏰ Time: {booking.time || "N/A"}</p>
            <p>📝 Purpose: {booking.purpose || "N/A"}</p>
            <p>👥 Attendees: {booking.attendees || "N/A"}</p>
            <p>💳 Payment: ₹{booking.totalAmount || 0}</p>
            <p>📌 Status: {booking.status || "Confirmed"}</p>
            {booking.status !== "Cancelled" && (
              <button
                onClick={() => cancelBooking(booking.id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHallBookings;
