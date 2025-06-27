import { useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error] = useState("");

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        name: user.displayName || "No Name",
        email: user.email,
        photoURL: user.photoURL || "",
        createdAt: new Date(),
      },
      { merge: true }
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await saveUserToFirestore(user);
      alert("Logged in!");
      navigate("/profile");
    } catch (error) {
  let message;
  switch (error.code) {
    case "auth/user-not-found":
      message = "This email is not registered with us. Please create an account.";
      navigate("/signup");
      break;
    case "auth/wrong-password":
      message = "Incorrect password. Please try again.";
      break;
    case "auth/invalid-credential":
      message = "Invalid login credentials. Please check your email and password.";
      break;
    default:
      message = "Login failed. Please try again.";
  }

  alert(message);
  console.error("Login Error:", error.code, error.message);
}

  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await saveUserToFirestore(user); // Optional: Update user record
      alert("Logged in!");
      navigate("/profile");
    } catch (error) {
  let message;
  switch (error.code) {
    case "auth/popup-closed-by-user":
      message = "Google sign-in was closed before completing.";
      break;
    case "auth/cancelled-popup-request":
      message = "Google sign-in was interrupted. Please try again.";
      break;
    case "auth/invalid-credential":
      message = "Google login credentials are invalid. Try again.";
      break;
    default:
      message = "Google login failed. Please try again.";
  }

  alert(message);
  console.error("Google Login Error:", error.code, error.message);
}

  };

  const { currentUser } = useAuth();
  console.log("Logged in user:", currentUser?.uid);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow mt-10 rounded">
      {/* Company Logo */}
      <img
        src="/mylogo.png"
        alt="MyCitiverse Logo"
        className="w-60 h-60 mb-4 mx-auto"
      />

      <h1 className="text-3xl text-black font-bold mb-6 text-center">
        Login to MyCitiverse
      </h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
        >
          Login
        </button>
      </form>

      <hr className="my-4" />
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Sign in with Google
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="mt-6 text-sm text-center text-black space-y-2">
        <p>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up here
          </Link>
        </p>
        {/*
        <p>
          Prefer phone login?{" "}
          <Link
            to="/phone-login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login via OTP
          </Link>
        </p>
        */}
        <p>
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
}
