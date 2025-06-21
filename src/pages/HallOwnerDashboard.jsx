import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const HallOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Step 1: Get all halls owned by current user
        const hallsRef = collection(db, "communityHalls");
        const hallsQuery = query(hallsRef, where("ownerId", "==", currentUser.uid));
        const hallsSnap = await getDocs(hallsQuery);
        const hallIds = hallsSnap.docs.map(doc => doc.id);

        if (hallIds.length === 0) {
          setBookings([]);
          setLoading(false);
          return;
        }

        // Step 2: Get all bookings for those halls
        const bookingsRef = collection(db, "hallBookings");
        const bookingsQuery = query(bookingsRef, where("hallId", "in", hallIds));
        const bookingsSnap = await getDocs(bookingsQuery);
        const data = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (error) {
        console.error("Error fetching hall bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const bookingRef = doc(db, "hallBookings", bookingId);
      await updateDoc(bookingRef, { status });
      // Refresh UI
      setBookings(prev =>
        prev.map(b => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) return <div>Loading booking requests...</div>;
  if (!bookings.length) return <div>No booking requests for your halls yet.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hall Booking Requests</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border rounded-lg p-4 shadow">
            <p><strong>Event:</strong> {b.eventName}</p>
            <p><strong>Date:</strong> {b.bookingDate}</p>
            <p><strong>Time:</strong> {b.timeSlot}</p>
            <p><strong>Purpose:</strong> {b.purpose}</p>
            <p><strong>Contact:</strong> {b.contact}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  b.status === "approved"
                    ? "text-green-600"
                    : b.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {b.status}
              </span>
            </p>
            {b.status === "pending" && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => updateBookingStatus(b.id, "approved")}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateBookingStatus(b.id, "rejected")}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOwnerDashboard;
