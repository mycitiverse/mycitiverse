import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const HallBookingsDashboard = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      // Step 1: Get all halls owned by current user
      const hallsQuery = query(
        collection(db, "communityHalls"),
        where("ownerId", "==", currentUser.uid)
      );
      const hallsSnapshot = await getDocs(hallsQuery);
      const hallIds = hallsSnapshot.docs.map(doc => doc.id);

      // Step 2: Get bookings for those halls
      if (hallIds.length === 0) return;
      const bookingsQuery = query(
        collection(db, "hallBookings"),
        where("hallId", "in", hallIds)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      const data = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    };

    fetchBookings();
  }, [currentUser]);

  // Step 3: Approve or Reject booking
  const updateStatus = async (bookingId, status) => {
    await updateDoc(doc(db, "hallBookings", bookingId), { status });
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📋 Booking Requests for Your Halls</h2>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="border rounded p-3 mb-3">
            <p><strong>Event:</strong> {b.eventName}</p>
            <p><strong>Date:</strong> {b.bookingDate}</p>
            <p><strong>Time:</strong> {b.timeSlot}</p>
            <p><strong>Purpose:</strong> {b.purpose}</p>
            <p><strong>Contact:</strong> {b.contact}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${
                b.status === "approved" ? "bg-green-200" :
                b.status === "rejected" ? "bg-red-200" :
                "bg-yellow-200"
              }`}>
                {b.status}
              </span>
            </p>
            <div className="mt-2 space-x-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(b.id, "approved")}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(b.id, "rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HallBookingsDashboard;
