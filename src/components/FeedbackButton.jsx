import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { db } from "../firebase"; // Update path if needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "feedback"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      alert("✅ Thank you! Your feedback has been submitted.");
      setFormData({ name: "", email: "", message: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error saving feedback:", error);
      alert("❌ Failed to send feedback. Try again.");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-4 shadow-lg z-50"
        title="Give Feedback"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-gray-800">We’d love your feedback 💬</h3>

            <input
              name="name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <textarea
              name="message"
              rows={4}
              placeholder="Your Feedback or Suggestion"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
