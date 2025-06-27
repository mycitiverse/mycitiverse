import React from "react";

export default function Disclaimer() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Disclaimer</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: June 26, 2025</p>

      <p>
        The information on this platform is provided in good faith but may contain errors or inaccuracies.
        <br /><br />
        <strong>MyCitiverse Technologies Pvt. Ltd.</strong> does not guarantee the quality, timing, or availability of any service or event listed.
        Users are advised to verify information with organizers or service providers before making bookings.
      </p>

      <p className="mt-6">
        We are not liable for any loss, delay, or damage arising from use of third-party services or user-organized events listed on the platform.
      </p>
    </div>
  );
}
