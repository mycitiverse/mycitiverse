// src/auth/UserProfile.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold mb-4">👤 Your Profile</h2>
      <p className="mb-2"><strong>Name:</strong> {currentUser.displayName || "Not set"}</p>
      <p className="mb-2"><strong>Email:</strong> {currentUser.email}</p>
      
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
