// src/auth/PhoneLogin.jsx
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Initialize reCAPTCHA only once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved, allow send OTP
          },
        },
        auth
      );
    }
  }, []);

  const handleSendOTP = async () => {
    setError("");
    setMessage("");

    // Basic phone number validation
    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, "+91" + phone, appVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setMessage("");

    if (otp.trim().length === 0) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      setMessage("Phone login successful!");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Login with Phone</h2>

      {!confirmationResult ? (
        <>
          <input
            type="tel"
            placeholder="Phone number (10 digits)"
            className="w-full border px-3 py-2 rounded mb-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleSendOTP}
            className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
          >
            Send OTP
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            onClick={handleVerifyOTP}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Verify OTP
          </button>
        </>
      )}

      <div id="recaptcha-container"></div>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}
