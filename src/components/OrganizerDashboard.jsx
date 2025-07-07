// src/components/OrganizerDashboard.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const OrganizerDashboard = () => {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;
      try {
        // Fetch all events created by this organizer
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("organizerId", "==", user.uid));
        const eventSnapshot = await getDocs(q);

        const eventIds = [];
        let bookingsCount = 0;
        let revenue = 0;

        for (const doc of eventSnapshot.docs) {
          const eventId = doc.id;
          eventIds.push(eventId);
        }

        setTotalEvents(eventIds.length);

        // Fetch bookings for these events
        const bookingsRef = collection(db, "bookings");
        const bookingsQ = query(bookingsRef, where("eventId", "in", eventIds));
        const bookingSnapshot = await getDocs(bookingsQ);

        bookingsCount = bookingSnapshot.size;
        bookingSnapshot.forEach((doc) => {
          const data = doc.data();
          revenue += data.bookingAmount || 0;
        });

        setTotalBookings(bookingsCount);
        setTotalRevenue(revenue);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Organizer Dashboard</h2>
      <div className="grid grid-cols-1 gap-4">
        <StatCard title="Total Events Hosted" value={totalEvents} />
        <StatCard title="Total Bookings" value={totalBookings} />
        <StatCard title="Total Revenue Earned" value={`₹${totalRevenue}`} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default OrganizerDashboard;
