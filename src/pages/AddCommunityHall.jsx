import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddCommunityHall = () => {
  const [hallData, setHallData] = useState({
    name: "",
    location: "",
    capacity: "",
    pricePerPlate: "",
    availability: "Available",
  });

  const [images, setImages] = useState([]); // ✅ separate image state

  const handleChange = (e) => {
    setHallData({ ...hallData, [e.target.name]: e.target.value });
  };

  const uploadAllImages = async () => {
    const urls = [];
    for (const image of images) {
      const imageRef = ref(storage, `hall-images/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageUrls = await uploadAllImages();

      const newHall = {
        ...hallData,
        capacity: Number(hallData.capacity),
        pricePerPlate: Number(hallData.pricePerPlate),
        images: imageUrls,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "communityHalls"), newHall);

      alert("Community hall added successfully!");

      // Reset form
      setHallData({
        name: "",
        location: "",
        capacity: "",
        pricePerPlate: "",
        availability: "Available",
      });
      setImages([]);
    } catch (error) {
      console.error("Error adding hall:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Community Hall</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Hall Name"
          value={hallData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={hallData.location}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={hallData.capacity}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          name="pricePerPlate"
          placeholder="Price per Plate (INR)"
          value={hallData.pricePerPlate}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />
        <select
          name="availability"
          value={hallData.availability}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          className="w-full p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="w-full bg-yellow-400 text-white py-3 rounded-lg hover:bg-yellow-500"
        >
          Add Hall
        </button>
      </form>
    </div>
  );
};

export default AddCommunityHall;
