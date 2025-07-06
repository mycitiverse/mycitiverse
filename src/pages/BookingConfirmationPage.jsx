import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CheckCircle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const BookingConfirmationPage = () => {
  const { type, bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const collectionName =
          type === "hall" ? "hallBookings" : "eventBookings";
        const docRef = doc(db, collectionName, bookingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBooking(docSnap.data());
        } else {
          console.error("No booking found.");
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };

    fetchBooking();
  }, [type, bookingId]);

  if (!booking) return <div className="p-4">Loading confirmation...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="text-center mb-6">
        <CheckCircle className="text-green-500 mx-auto" size={48} />
        <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
        <p className="text-gray-600">
          Your {type === "hall" ? "hall" : "event"} booking is confirmed.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
        <div>
          <h2 className="font-bold text-xl mb-1">Booking Details:</h2>
          <p><strong>Booking ID:</strong> {bookingId}</p>
          <p>
            <strong>{type === "hall" ? "Hall Name" : "Event"}:</strong> {booking.eventName}
          </p>
          {type !== "hall" && (
            <p><strong>Tickets:</strong> {booking.tickets}</p>
          )}
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
          Show this QR code at the {type === "hall" ? "hall reception" : "event entry"} for verification.
        </p>
        <div className="flex justify-center">
          <div className="p-4 bg-gray-100 rounded-md shadow w-fit">
            <QRCodeCanvas value={bookingId} size={160} className="mx-auto" />
            <p className="mt-2 text-xs text-center text-gray-500">Booking ID: {bookingId}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">Check your email for confirmation details.</p>
        <Link
          to={type === "hall" ? "/halls" : "/events"}
          className="inline-block mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md shadow"
        >
          Browse More {type === "hall" ? "Halls" : "Events"}
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
