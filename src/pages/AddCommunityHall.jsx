import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/cloudinary";

const AddCommunityHall = () => {
  const [hallData, setHallData] = useState({
    name: "",
    location: "",
    capacity: "",
    pricePerPlate: "",
    availability: "Available",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setHallData({ ...hallData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...imagePreviews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const uploadAllImages = async (onProgress = () => {}) => {
    const urls = [];
    for (let i = 0; i < images.length; i++) {
      const url = await uploadToCloudinary(images[i], onProgress);
      if (url) urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      setUploadProgress(0);

      const thumbnailUrl = thumbnail
        ? await uploadToCloudinary(thumbnail, (progress) => setUploadProgress(progress))
        : "";

      const galleryUrls = await uploadAllImages();

      const newHall = {
        ...hallData,
        capacity: Number(hallData.capacity),
        pricePerPlate: Number(hallData.pricePerPlate),
        thumbnail: thumbnailUrl,
        images: galleryUrls,
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
      setThumbnail(null);
      setThumbnailPreview(null);
      setImages([]);
      setImagePreviews([]);
      setUploadProgress(0);
      setUploading(false);
    } catch (error) {
      console.error("Error adding hall:", error);
      alert("Something went wrong while adding the hall.");
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Community Hall</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Hall Name" value={hallData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <input type="text" name="location" placeholder="Location" value={hallData.location} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <input type="number" name="capacity" placeholder="Capacity" value={hallData.capacity} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <input type="number" name="pricePerPlate" placeholder="Price per Plate (INR)" value={hallData.pricePerPlate} onChange={handleChange} className="w-full p-3 border rounded-lg" required />

        <select name="availability" value={hallData.availability} onChange={handleChange} className="w-full p-3 border rounded-lg">
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <div>
          <label className="font-medium block mb-1">Thumbnail Image</label>
          <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full p-3 border rounded-lg" />
          {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-2 rounded-md object-cover h-40 w-full border" />}
        </div>

        <div>
          <label className="font-medium block mb-1">Gallery Images</label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full p-3 border rounded-lg" />
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap mt-2 gap-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Moved Upload Status Bar Here */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-lg mb-2">
            <div
              className="bg-blue-500 text-xs font-bold text-white text-center p-2 rounded-lg"
              style={{ width: `${uploadProgress}%` }}
            >
              Uploading: {uploadProgress}%
            </div>
          </div>
        )}

        <button type="submit" className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Hall"}
        </button>
      </form>
    </div>
  );
};

export default AddCommunityHall;
