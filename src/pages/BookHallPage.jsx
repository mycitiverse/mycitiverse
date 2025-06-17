import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

const BookHallPage = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

const [errors, setErrors] = useState({
  personName: "",
  contactInfo: "",
  attendees: "",
  otherPurpose: "",
});


  const [hall, setHall] = useState(null);

  // Booking form state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [personName, setPersonName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [attendees, setAttendees] = useState("");
  const [purpose, setPurpose] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const docRef = doc(db, "communityHalls", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHall({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such hall!");
        }
      } catch (error) {
        console.error("Error getting hall:", error);
      }
    };

    fetchHall();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hall) return alert("Hall data is still loading. Try again.");

    // ✅ Check if the selected date & time is in the future
  const selectedDateTime = new Date(`${date}T${time}`);
  const now = new Date();

  if (selectedDateTime <= now) {
    return alert("Please select a future date and time.");
  }

  if (date === new Date().toISOString().split("T")[0] && time <= now.toTimeString().slice(0, 5)) {
  return alert("Please select a valid future time.");
}


    if (purpose === "Others" && !otherPurpose.trim()) {
      return alert("Please specify the purpose of booking.");
    }

    if (isNaN(attendees) || Number(attendees) <= 0) {
      return alert("Please enter a valid number of attendees.");
    }
    if (Number(attendees) > hall.capacity) {
  return alert(`Number of attendees cannot exceed hall capacity of ${hall.capacity}.`);
}


    try {
     // ✅ Check for duplicate booking
    const bookingsRef = collection(db, "hallBookings");
    const q = query(
      bookingsRef,
      where("hallId", "==", id),
      where("date", "==", date.trim())
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return alert("This hall is already booked for the selected date. Please choose another day.");
    }

      await addDoc(collection(db, "hallBookings"), {
        hallId: id,
        hallName: hall.name,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        date: date.trim(),
        time: time.trim(),
        personName: personName.trim(),
        contactInfo: contactInfo.trim(),
        attendees: Number(attendees),
        purpose: purpose === "Others" ? otherPurpose.trim() : purpose,
        notes: notes.trim(),
        totalAmount: hall.pricePerPlate * Number(attendees),
        paymentStatus: "Paid",
        status: "Confirmed",
        createdAt: new Date(),
      });
      alert("Booking confirmed!");
      navigate("/community-hall");
    } catch (error) {
      console.error("Error booking hall:", error);
      alert("Failed to book. Try again.");
    }
  };

  const totalCost =
    hall && attendees && !isNaN(attendees)
      ? hall.pricePerPlate * Number(attendees)
      : 0;

      const isFormValid =
  personName &&
  contactInfo &&
  date &&
  time &&
  attendees &&
  purpose &&
  (purpose !== "Others" || otherPurpose) &&
  !Object.values(errors).some((e) => e);


  if (!hall) return <div className="p-4">Loading hall details...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded-xl shadow">
      <h2 className="text-center font-bold text-4xl mb-5">📅 Book: <span className="text-red-600">{hall.name}</span></h2>
      {hall.thumbnail && (
  <img
    src={hall.thumbnail}
    alt={`${hall.name} thumbnail`}
    className="w-full h-64 object-cover rounded mb-4"
  />
)}

      <p className="text-gray-700 mb-2">📍 Location: <b>{hall.location}</b></p>
      <p className="text-gray-700 mb-5">
        👥 Capacity: <b>{hall.capacity}</b> | 💰 Price/Plate: <span className="text-green-600 font-bold">₹{hall.pricePerPlate}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name of Person: <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={personName}
            onChange={(e) => {
    const value = e.target.value;
    // Allow only alphabets and space
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setPersonName(value);
      setErrors((prev) => ({ ...prev, personName: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        personName: "Only alphabets and spaces are allowed.",
      }));
    }
  }}
            className="w-full border rounded px-3 py-2"
            placeholder="Your full name"
          />
          {errors.personName && <p className="text-red-500 text-sm mt-1">{errors.personName}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Information: <span className="text-red-500">*</span></label>
          <input
            type="tel"
            required
            value={contactInfo}
            onChange={(e) => {
    const value = e.target.value;
    // Allow only numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setContactInfo(value);
      if (value.length === 10) {
        setErrors((prev) => ({ ...prev, contactInfo: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          contactInfo: "Phone number must be 10 digits.",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        contactInfo: "Only numbers are allowed.",
      }));
    }
  }}
            className="w-full border rounded px-3 py-2"
            placeholder="Phone number"
          />
          {errors.contactInfo && <p className="text-red-500 text-sm mt-1">{errors.contactInfo}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Date: <span className="text-red-500">*</span></label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min={new Date().toISOString().split("T")[0]} // ✅ restricts past dates
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Select Time: <span className="text-red-500">*</span></label>
          <input
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Number of Attendees: <span className="text-red-500">*</span></label>
          <input
            type="number"
            required
            min="1"
            max={hall.capacity}
            value={attendees}
            onChange={(e) => {
  const value = Number(e.target.value);
  if (/^\d*$/.test(value) && Number(value) >= 0 && value <= hall.capacity) 
    {
      setAttendees(e.target.value);
      setErrors((prev) => ({ ...prev, attendees: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        attendees: `Please enter a valid number greater than 0 and less than ${hall.capacity}.`,
      }));
    }
}}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter number of attendees"
          />
          {errors.attendees && <p className="text-red-500 text-sm mt-1">{errors.attendees}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Purpose of Booking: <span className="text-red-500">*</span></label>
          <select
            required
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="" disabled>Select purpose</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Meeting">Meeting</option>
            <option value="Seminar">Seminar</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {purpose === "Others" && (
          <div>
            <label className="block mb-1 font-medium">Please specify: <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={otherPurpose}
              onChange={(e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setOtherPurpose(value);
      setErrors((prev) => ({ ...prev, otherPurpose: "" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            otherPurpose: "Only alphabets and spaces are allowed.",
          }));
    }
  }}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter other purpose"
              required
            />
            {errors.otherPurpose && (
      <p className="text-red-500 text-sm mt-1">{errors.otherPurpose}</p>
    )}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Additional Notes / Requests:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Any additional info"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-lg font-bold text-green-600">
            Total Amount: ₹{totalCost}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
  className={`px-4 py-2 rounded text-white ${
    isFormValid ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-300 cursor-not-allowed"
  }`}
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookHallPage;
