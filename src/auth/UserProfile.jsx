import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { uploadToCloudinary } from "../utils/cloudinary";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Lightbox control

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    setUploading(true);

    try {
      const photoURL = await uploadToCloudinary(file);
      await updateProfile(currentUser, { photoURL });

      window.location.reload(); // or use context to re-render instead
    } catch (error) {
      console.error("Error uploading:", error);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-10">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow rounded text-center">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      {currentUser.photoURL ? (
        <>
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full mb-4 object-cover cursor-pointer hover:opacity-90"
            title="Click to view full size"
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={[{ src: currentUser.photoURL }]}
              plugins={[Zoom]}
              animation={{ fade: 250 }}
            />
          )}
        </>
      ) : (
        <p className="mb-2 text-gray-500">No profile picture uploaded.</p>
      )}

      <label className="block mt-2 mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <span className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">
          {currentUser.photoURL ? "Change Photo" : "Upload Profile Picture"}
        </span>
      </label>

      {uploading && <p className="text-sm text-gray-600 mb-2">Uploading...</p>}

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
