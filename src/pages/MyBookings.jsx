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
import { QRCodeCanvas } from "qrcode.react";
import { CheckCircle } from "lucide-react";

const MyBookings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("hall");
  const [hallBookings, setHallBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const [hallSnap, eventSnap] = await Promise.all([
          getDocs(
            query(
              collection(db, "hallBookings"),
              where("userId", "==", currentUser.uid)
            )
          ),
          getDocs(
            query(
              collection(db, "eventBookings"),
              where("userId", "==", currentUser.uid)
            )
          ),
        ]);

        setHallBookings(hallSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setEventBookings(eventSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching bookings:", err);
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
      alert("Booking cancelled.");

      // Refresh
      const hallSnap = await getDocs(
        query(
          collection(db, "hallBookings"),
          where("userId", "==", currentUser.uid)
        )
      );
      setHallBookings(hallSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel.");
    }
  };

  const renderHallBookings = () => {
    if (!hallBookings.length) return <div>No hall bookings found.</div>;

    return (
      <div className="space-y-6">
        {hallBookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() =>
              setExpandedBooking(expandedBooking === booking.id ? null : booking.id)
            }
            className="border p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-yellow-600">
                {booking.hallName || "Community Hall"}
              </h3>
              <span
                className={`font-semibold ${
                  booking.status === "Cancelled"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {booking.status || "Confirmed"}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              📅 {booking.date} ⏰ {booking.time}
            </p>

            {expandedBooking === booking.id && (
              <div className="mt-4 space-y-2 text-sm md:text-base">
                <p><strong>📝 Purpose:</strong> {booking.purpose || "N/A"}</p>
                <p><strong>👥 Attendees:</strong> {booking.attendees || "N/A"}</p>
                <p><strong>💳 Amount Paid:</strong> ₹{booking.totalAmount || 0}</p>
                <p><strong>📞 Contact:</strong> {booking.contactInfo || "N/A"}</p>
                <p><strong>📧 Email:</strong> {booking.userEmail || "N/A"}</p>

                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2">🎟️ QR Code</h4>
                  <div className="inline-block p-2 bg-gray-100 rounded">
                    <QRCodeCanvas value={booking.id} size={120} />
                    <p className="text-xs text-gray-500 mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>
                </div>

                {booking.status !== "Cancelled" && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelBooking(booking.id);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderEventBookings = () => {
    if (!eventBookings.length) return <div>No event bookings found.</div>;

    return (
      <div className="space-y-6">
        {eventBookings.map((booking) => (
          <div
            key={booking.id}
            onClick={() =>
              setExpandedBooking(expandedBooking === booking.id ? null : booking.id)
            }
            className="border p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-yellow-600">
                {booking.eventName || "Event"}
              </h3>
              <span
                className={`font-semibold ${
                  booking.status === "Cancelled"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {booking.status || "Confirmed"}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              🎟️ Tickets: {booking.tickets || 1}
            </p>

            {expandedBooking === booking.id && (
              <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="text-center mb-6">
        <CheckCircle className="text-green-500 mx-auto" size={48} />
        <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
        <p className="text-gray-600">Your event booking is confirmed.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
        <div>
          <h2 className="font-bold text-xl mb-1">Booking Details:</h2>
          <p><strong>Booking ID:</strong> {booking.Id}</p>
          <p><strong>Event:</strong> {booking.eventName}</p>
          <p><strong>Tickets:</strong> {booking.tickets}</p>
          <p><strong>Notes:</strong> {booking.notes || "None"}</p>
        </div>
        <div>
          <h2 className="font-bold text-xl mb-1">Payment Info:</h2>
          <p><strong>Name:</strong> {booking.personName}</p>
          <p><strong>Email:</strong> {booking.userEmail}</p>
          <p><strong>Phone:</strong> {booking.contactInfo}</p>
          <p><strong>Total Paid:</strong> ₹{booking.totalAmount}</p>
        </div>
      </div>

      {/* QR Code */}
<div className="mt-8 text-center">
  <h2 className="text-xl font-bold mb-2">QR Code for Entry</h2>
  <p className="text-sm text-gray-600 mb-2">
    Show this QR code at the event entry for verification.
  </p>

  {/* Centered QR Box */}
  <div className="flex justify-center">
    <div className="p-4 bg-gray-100 rounded-md shadow w-fit">
      <QRCodeCanvas value={booking.Id} size={160} className="mx-auto" />
      <p className="mt-2 text-xs text-center text-gray-500">Booking ID: {booking.Id}</p>
    </div>
  </div>
  </div>
  </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Bookings</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("hall")}
          className={`px-4 py-2 rounded-l-md ${
            activeTab === "hall"
              ? "bg-yellow-400 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Community Hall
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className={`px-4 py-2 rounded-r-md ${
            activeTab === "event"
              ? "bg-yellow-400 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Events
        </button>
      </div>

      {loading ? (
        <div>Loading your bookings...</div>
      ) : activeTab === "hall" ? (
        renderHallBookings()
      ) : (
        renderEventBookings()
      )}
    </div>
  );
};

export default MyBookings;
