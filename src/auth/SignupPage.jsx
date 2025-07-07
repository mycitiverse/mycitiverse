// src/auth/SignupPage.jsx
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    city: "",
    role: "",
    termsAccepted: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  useEffect(() => {
  let countdown;
  if (otpSent && !resendAvailable) {
    countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResendAvailable(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(countdown);
}, [otpSent, resendAvailable]);


  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validateName = (name) => /^[A-Za-z ]+$/.test(name);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,15}$/.test(password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    // Live validation
    let error = "";

    switch (name) {
      case "name":
        if (fieldValue && !validateName(fieldValue)) {
          error = "Only letters and spaces allowed.";
        }
        break;
      case "email":
        if (fieldValue && !validateEmail(fieldValue)) {
          error = "Invalid email format.";
        }
        break;
      case "phone":
        if (fieldValue && !/^[0-9]{0,10}$/.test(fieldValue)) {
          error = "Only 10 digit numbers allowed.";
        }
        break;
      case "password":
        if (fieldValue && !validatePassword(fieldValue)) {
          error =
            "6–15 chars, with uppercase, lowercase, number & special character.";
        }
        break;
      case "confirmPassword":
        if (fieldValue && fieldValue !== formData.password) {
          error = "Passwords do not match.";
        }
        break;
      case "city":
        if (fieldValue && !/^[A-Za-z ]+$/.test(fieldValue)) {
         error = "Only letters and spaces allowed.";
        }
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const sendOtp = async () => {
    if (isSendingOtp) return; // ⛔ Prevent double click
     setIsSendingOtp(true); // 🔒 Block the button
  try {
    await axios.post("https://mycitiverse-backend.onrender.com/send-otp", {
      email: formData.email,
    });
    setOtpSent(true);
    setOtpVerified(false);
    setResendAvailable(false);
    setTimer(60);
    setOtpMessage("OTP sent to your email.");
  } catch (error) {
    setOtpMessage("Failed to send OTP. Try again.");
    console.error(error);
    } finally {
    setIsSendingOtp(false); // 🔓 Unblock after request is done
  }
};

const verifyOtp = async () => {
  try {
    await axios.post("https://mycitiverse-backend.onrender.com/verify-otp", {
      email: formData.email,
      otp,
    });
    setOtpVerified(true);
    setOtpMessage("✅ OTP verified! You may proceed.");
  } catch (error) {
    setOtpVerified(false);
    setOtpMessage("❌ Invalid or expired OTP.");
    console.error(error);
  }
};

const pingServerOnInputFocus = async () => {
  const start = Date.now();

  try {
    await fetch("https://mycitiverse-backend.onrender.com/warmup"); // Replace with your actual backend URL
    const duration = Date.now() - start;

    if (duration > 10000) {
      console.log("⏳ Server was asleep. Took:", duration, "ms to respond");
    } else {
      console.log("✅ Server is already awake. Responded in:", duration, "ms");
    }
  } catch (err) {
    console.error("⚠️ Server ping failed:", err);
  }
};


  const handleSignup = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      gender,
      city,
      role,
      termsAccepted,
    } = formData;

    const errors = {};

    if (!validateName(name)) {
      errors.name = "Name must contain only alphabets and spaces.";
    }
    if (!validatePhone(phone)) {
      errors.phone = "Phone number must be 10 digits.";
    }
    if (!validateEmail(email)) {
      errors.email = "Email must be valid.";
    }
    if (!otpVerified) {
      setOtpMessage("Please verify your email with OTP before signing up.");
     return;
    }
    if (!validatePassword(password)) {
      errors.password =
        "Password must be 6–15 characters with uppercase, lowercase, number, and special character.";
    }
    if (!validateName(city)) {
     errors.city = "City must contain only alphabets and spaces.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!gender) {
      errors.gender = "Please select your gender.";
    }
    if (!city) {
      errors.city = "Please enter your city.";
    }
    if (!role) {
      errors.role = "Please select your role.";
    }
    if (!termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions.";
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      await setDoc(doc(db, "users", userCred.user.uid), {
        name,
        email,
        phone,
        gender,
        city,
        role,
        createdAt: new Date(),
      });

      // ✅ 2. Call backend to send welcome email
    try {
      await axios.post("https://mycitiverse-backend.onrender.com/api/sendWelcomeEmail", {
        name,
        email,
      });
    } catch (emailError) {
      console.error("Welcome email failed to send:", emailError);
      // Optional: show toast or alert here
    }

      alert("Account created successfully!");
      navigate("/profile");
    } catch (err) {
      setFieldErrors({ firebase: err.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Your Account
        </h2>

        {fieldErrors.firebase && (
          <p className="text-red-500 text-sm mb-4 text-center">{fieldErrors.firebase}</p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className="w-full border px-3 py-2 rounded"
              placeholder="John Doe"
              onFocus={pingServerOnInputFocus}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          {/* OTP */}
          {otpSent && !otpVerified && (
  <div className="mt-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Enter OTP
    </label>
    <input
      type="text"
      className="w-full border px-3 py-2 rounded mb-2"
      placeholder="Enter the 6-digit OTP"
      value={otp}
      maxLength={6}
      inputMode="numeric"
      pattern="\d{6}"
      onChange={(e) => {
        const value = e.target.value;
    // Allow only digits
    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  }}
    />
    <button
      type="button"
      onClick={verifyOtp}
      className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
    >
      Verify OTP
    </button>
    <button
      type="button"
      onClick={sendOtp}
      disabled={!resendAvailable || isSendingOtp}
      className={`px-3 py-2 rounded ${
        resendAvailable && !isSendingOtp
        ? "bg-yellow-400 text-white hover:bg-yellow-500" : "bg-gray-300 cursor-not-allowed text-gray-500"}`}
    >
      {isSendingOtp
      ? "Sending..."
      : resendAvailable
      ? "Resend OTP"
      : `Resend in ${timer}s`}
    </button>
  </div>
)}

{!otpSent && (
  <button
    type="button"
    onClick={sendOtp}
    disabled={isSendingOtp}
    className={`mt-2 px-3 py-2 rounded ${
      isSendingOtp
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-yellow-400 text-white hover:bg-yellow-500"
    }`}
  >
    {isSendingOtp ? "Sending..." : "Send OTP"}
  </button>
)}


{otpMessage && (
  <p className={`text-sm mt-2 ${otpVerified ? "text-green-600" : "text-red-500"}`}>
    {otpMessage}
  </p>
)}

<fieldset disabled={!otpVerified} className="mt-4 space-y-4">

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full border px-3 py-2 rounded"
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              className="w-full border px-3 py-2 rounded"
              placeholder="Create strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be 6–15 characters with uppercase, lowercase, number & special character.
            </p>
            {fieldErrors.password && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border px-3 py-2 rounded"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              className="w-full border px-3 py-2 rounded"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {fieldErrors.gender && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              className="w-full border px-3 py-2 rounded"
              placeholder="Your City"
              value={formData.city}
              onChange={(e) => {
    const value = e.target.value;
    if (/^[A-Za-z ]*$/.test(value)) {
      handleChange(e);
    }
  }}
              required
            />
            {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
          </div>

          {/* Role Selection */}
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Register As <span className="text-red-500">*</span>
  </label>
  <select
    name="role"
    value={formData.role}
    onChange={handleChange}
    className="w-full border px-3 py-2 rounded"
    required
  >
    <option value="">-- Select Role --</option>
    <option value="user">User</option>
    <option value="organizer">Event Organizer</option>
    <option value="hall_owner">Community Hall Owner</option>
    <option value="influencer">Influencer</option>
  </select>
  {fieldErrors.role && (
    <p className="text-red-500 text-xs mt-1">{fieldErrors.role}</p>
  )}
  </div>

  </fieldset>

          {/* Terms */}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
            <label className="text-sm text-gray-700">
              I agree to the{" "}
              <a href="/terms" className="text-yellow-500 font-medium hover:underline">
                Terms and Conditions
              </a>
              <span className="text-red-500"> *</span>
            </label>
          </div>
          {fieldErrors.termsAccepted && (
            <p className="text-red-500 text-xs mt-1">{fieldErrors.termsAccepted}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white font-semibold py-2 rounded hover:bg-yellow-500 transition duration-200 mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 font-medium hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
