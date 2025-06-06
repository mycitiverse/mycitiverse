import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const MyHallBookings = () => {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchBookings = async () => {
      const q = query(
        collection(db, "hallBookings"),
        where("userEmail", "==", currentUser.email),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(results);
    };

    fetchBookings();
  }, [currentUser]);

  if (!currentUser) return <p className="p-4">Please log in to view your bookings.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Hall Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold text-lg">{booking.hallName}</h3>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p className="text-sm text-gray-500">
                Booked on: {new Date(booking.createdAt.toDate()).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyHallBookings;
