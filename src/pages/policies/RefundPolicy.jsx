import React from "react";

export default function RefundPolicy() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Refund and Cancellation Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: June 26, 2025</p>

      <h2 className="text-lg font-semibold mt-6">1. Cancellation by Users</h2>
      <p>
        - Cancellations are subject to the terms of the hall owner or event organizer.<br />
        - If allowed, refunds will be processed after deducting platform fees and applicable taxes.
      </p>

      <h2 className="text-lg font-semibold mt-6">2. Cancellation by Organizers</h2>
      <p>
        - If an event is canceled by the organizer, a full refund will be issued to the user.<br />
        - Refunds will be processed within 7–10 working days.
      </p>

      <h2 className="text-lg font-semibold mt-6">3. Non-Refundable Situations</h2>
      <ul className="list-disc ml-6">
        <li>Community hall booking amounts are strictly non-refundable under any circumstances.</li>
        <li>No-shows at the venue</li>
        <li>Last-minute cancellations (under 24 hours)</li>
        <li>Violation of terms during booking</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">4. Refund Process</h2>
      <p>For refund requests, email us at mycitiverse@gmail.com with your booking ID and reason for cancellation.</p>
    </div>
  );
}
