import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/cloudinary";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";

const availableFacilities = [
  "Air Conditioning", "Parking", "Projector", "Wi-Fi", "Catering",
  "Decoration", "Sound System", "Stage", "Chairs & Tables",
];

const AddCommunityHall = () => {
  const [hallData, setHallData] = useState({
    name: "", location: "", address: "", googleMapLink: "",
    capacity: "", pricePerPlate: "", availability: "Available",
    ownerId: "", facilities: [],
  });

  const [croppedThumbnail, setCroppedThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setHallData({ ...hallData, [e.target.name]: e.target.value });
  };

  const handleFacilityToggle = (facility) => {
    setHallData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const imageUrl = URL.createObjectURL(file);
      setThumbnailPreview(imageUrl);
      setShowCropper(true);
    }
  };

  const handleCropComplete = async () => {
  try {
    const file = await getCroppedImg(thumbnailPreview, croppedAreaPixels); // already returns File

    setCroppedThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file)); // show preview
    setShowCropper(false);
  } catch (error) {
    console.error("Cropping failed:", error);
  }
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

      const thumbnailUrl = croppedThumbnail
        ? await uploadToCloudinary(croppedThumbnail, setUploadProgress)
        : "";

      const galleryUrls = await uploadAllImages(setUploadProgress);

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
        name: "", location: "", address: "", googleMapLink: "",
        capacity: "", pricePerPlate: "", availability: "Available",
        ownerId: "", facilities: [],
      });
      setCroppedThumbnail(null);
      setThumbnailPreview(null);
      setShowCropper(false);
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
        <input type="text" name="address" placeholder="Complete Address" value={hallData.address} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <input type="url" name="googleMapLink" placeholder="Google Map Link" value={hallData.googleMapLink} onChange={handleChange} className="w-full p-3 border rounded-lg" />
        <input type="number" name="capacity" placeholder="Capacity" value={hallData.capacity} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <input type="number" name="pricePerPlate" placeholder="Price per Plate (INR)" value={hallData.pricePerPlate} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
        <input type="text" name="ownerId" placeholder="Owner UID" value={hallData.ownerId} onChange={handleChange} className="w-full p-3 border rounded-lg" required />

        <div>
          <label className="block font-medium mb-2">Facilities Offered:</label>
          <div className="grid grid-cols-2 gap-2">
            {availableFacilities.map((facility, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={facility}
                  checked={hallData.facilities.includes(facility)}
                  onChange={() => handleFacilityToggle(facility)}
                  className="accent-yellow-500"
                />
                <span>{facility}</span>
              </label>
            ))}
          </div>
        </div>

        <select name="availability" value={hallData.availability} onChange={handleChange} className="w-full p-3 border rounded-lg">
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <div>
  <label className="font-medium block mb-1">Thumbnail Image:</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleThumbnailChange}
    className="w-full p-3 border rounded-lg"
  />

  {/* Cropper UI */}
  {showCropper && thumbnailPreview && (
    <div className="mt-3">
      <div className="relative w-full h-[300px] bg-black rounded-md overflow-hidden">
        <Cropper
          image={thumbnailPreview}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, croppedArea) => setCroppedAreaPixels(croppedArea)}
        />
      </div>
      <button
        type="button"
        onClick={handleCropComplete}
        className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Crop & Save
      </button>
    </div>
  )}

  {/* Final Cropped Preview */}
  {!showCropper && croppedThumbnail && (
    <div className="mt-3">
      <div
        className="relative w-full rounded-md overflow-hidden"
        style={{ paddingBottom: "56.25%" }}
      >
        <img
          src={thumbnailPreview}
          alt="Cropped Thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover border"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        <em>Final thumbnail preview (16:9 ratio)</em>
      </p>
    </div>
  )}
</div>

{/* Gallery Upload */}
<div>
  <label className="font-medium block mb-1">Gallery Images:</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleGalleryChange}
    required
    className="w-full p-3 border rounded-lg"
  />
  {imagePreviews.length > 0 && (
    <div className="flex flex-wrap mt-2 gap-2">
      {imagePreviews.map((src, index) => (
        <div key={index} className="relative w-24 h-24">
          <img
            src={src}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-cover rounded"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )}
</div>


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
