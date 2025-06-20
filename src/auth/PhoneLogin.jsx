// src/auth/PhoneLogin.jsx
import { useState } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: () => handleSendOTP(),
      }, auth);

      const result = await signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setMessage("OTP sent!");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await confirmationResult.confirm(otp);
      setMessage("Phone login successful!");
    } catch (error) {
      setMessage("Invalid OTP.");
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
            className="w-full border px-3 py-2 rounded mb-4"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
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
            className="w-full border px-3 py-2 rounded mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOTP}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Verify OTP
          </button>
        </>
      )}
      <div id="recaptcha-container"></div>
      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
}
