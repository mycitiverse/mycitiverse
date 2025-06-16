import React from "react";
import { auth, provider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from "firebase/firestore";

// If the logo is in src/assets
// import logo from '../assets/logo.png';

const LoginPage = () => {

  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "No Name",
      email: user.email,
      photoURL: user.photoURL || "",
      createdAt: new Date(),
    }, { merge: true });
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await saveUserToFirestore(user);

      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/";
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  const { currentUser } = useAuth();  
  console.log("Logged in user:", currentUser?.uid);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Company Logo */}
      <img 
        src="/mylogo.png" // or use {logo} if imported
        alt="MyCitiverse Logo"
        className="w-32 h-32 mb-4" // Adjust size as needed
      />
      
      <h1 className="text-3xl font-bold mb-6">Welcome to MyCitiverse</h1>
      
      <button
        onClick={handleLogin}
        className="bg-yellow-400 text-white px-6 py-3 rounded-xl shadow hover:bg-yellow-500"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginPage;
