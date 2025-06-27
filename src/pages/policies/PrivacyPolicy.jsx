import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Effective Date: June 26, 2025</p>

      <p><strong>MyCitiverse</strong> respects your privacy. This policy explains how we collect, use, and protect your personal data.</p>

      <h2 className="text-lg font-semibold mt-6">1. What We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Name, email, phone number</li>
        <li>Location (if allowed)</li>
        <li>Booking and usage history</li>
        <li>Device/browser data (via cookies)</li>
      </ul>

      <h2 className="text-lg font-semibold mt-6">2. Why We Collect It</h2>
      <p>To improve service experience, process bookings, and provide personalized event and service recommendations.</p>

      <h2 className="text-lg font-semibold mt-6">3. Data Sharing</h2>
      <p>We do not sell your data. We may share data with trusted partners (event organizers, hall owners, payment processors) strictly to serve you better.</p>

      <h2 className="text-lg font-semibold mt-6">4. Data Security</h2>
      <p>We use encryption, secure tokens, HTTPS, and cloud storage with access control to protect your data.</p>

      <h2 className="text-lg font-semibold mt-6">5. Your Rights</h2>
      <p>You may access, update, or delete your data by contacting: mycitiverse@gmail.com</p>
    </div>
  );
}
