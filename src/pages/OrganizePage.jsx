import { useState, useEffect } from 'react';
import { Input } from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { Label } from "../components/ui/Label";
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext';
import { uploadToCloudinary } from '../utils/cloudinary';
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage"; // Make sure this util function exists


export default function OrganizePage() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    fullAddress: '',
    googleMapLink: '',
    category: '',
    thumbnail: null,
    eventImages: [],
    isPaid: false,
    price: 0,
    maxSeats: 0,
    tags: '',
    contact: '',
    creditTo: '',
    isVerified: false,
  });

  const [showCropper, setShowCropper] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState(null);


  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [eventImagePreviews, setEventImagePreviews] = useState([]);
  const [user, setUser] = useState(null);

  const categories = ['Meeting', 'Conference', 'Workshop', 'Social', 'Sports', 'Other'];

  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login";
    } else {
      setUser(currentUser);
      setFormData(prev => ({
        ...prev,
        time: new Date().toTimeString().slice(0, 5),
      }));
    }
  }, [currentUser]);

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'contact') {
      // Only allow numbers and limit to 10 digits
      const filtered = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: filtered }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCropConfirm = async () => {
  try {
    const croppedFile = await getCroppedImg(thumbnailPreview, croppedAreaPixels);
    setFormData(prev => ({ ...prev, thumbnail: croppedFile }));
    setCroppedImage(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  } catch (e) {
    console.error("Crop error:", e);
    alert("Cropping failed. Please try again.");
  }
};




  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
    const imageUrl = URL.createObjectURL(file);
    setThumbnailPreview(imageUrl);
    setShowCropper(true);
  }
};

  const handleEventImagesUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setFormData(prev => ({ ...prev, eventImages: files }));
    setEventImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category || !formData.thumbnail) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.contact && formData.contact.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(10);

      // Upload Thumbnail
      const thumbnailUrl = await uploadToCloudinary(formData.thumbnail);
      setUploadProgress(50);

      // Upload Event Images
      const eventImageUrls = [];
for (const file of formData.eventImages) {
  try {
    const url = await uploadToCloudinary(file);
    eventImageUrls.push(url);
  } catch (err) {
    console.error("Error uploading image:", file.name, err);
    alert("One of the event images failed to upload. Please check file size or format.");
    setUploading(false);
    return;
  }
}
setUploadProgress(90);

      setUploadProgress(90);

      // Save to Firestore
      await addDoc(collection(db, "events"), {
  title: formData.title,
  description: formData.description,
  date: formData.date,
  time: formData.time,
  location: formData.location,
  category: formData.category,
  thumbnailUrl, // ✅ use uploaded URL
  eventImageUrls, // ✅ use uploaded URLs
  isPaid: formData.isPaid,
  price: formData.isPaid ? Number(formData.price) : 0,
  maxSeats: formData.isPaid ? Number(formData.maxSeats) : 0,
  tags: formData.tags.split(',').map(tag => tag.trim()),
  contact: formData.contact,
  creditTo: formData.creditTo || '',
  isVerified: formData.isVerified || false,
  bookedUsers: [],
  createdAt: Timestamp.now(),
  createdBy: user?.email || "anonymous"
});


      setUploadProgress(100);
      alert("Event saved successfully!");

      // Reset
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        fullAddress: '',
        googleMapLink: '',
        category: '',
        thumbnail: null,
        eventImages: [],
        isPaid: false,
        price: 0,
        maxSeats: 0,
        tags: '',
        contact: '',
        creditTo: '',
        isVerified: false,
      });
      setThumbnailPreview('');
      setEventImagePreviews([]);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to save event. Try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-2xl text-center">Organize an Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                <Input id="date" name="date" type="date" min={getTodayDate()} value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time <span className="text-red-500">*</span></Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullAddress">Full Address <span className="text-red-500">*</span></Label>
              <Input id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapLink">Google Map Link <span className="text-red-500">*</span></Label>
              <Input id="googleMapLink" name="googleMapLink" value={formData.googleMapLink} onChange={handleChange} required />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
              <Select.Root value={formData.category} onValueChange={handleCategoryChange}>
                <Select.Trigger className="inline-flex w-full px-3 py-2 border rounded-md bg-white text-sm">
                  <Select.Value placeholder="Select a category" />
                  <Select.Icon><ChevronDownIcon /></Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-md border shadow-md">
                    <Select.ScrollUpButton><ChevronUpIcon /></Select.ScrollUpButton>
                    <Select.Viewport className="p-2">
                      {categories.map(cat => (
                        <Select.Item key={cat} value={cat} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          <Select.ItemText>{cat}</Select.ItemText>
                          <Select.ItemIndicator><CheckIcon /></Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton><ChevronDownIcon /></Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Thumbnail Image */}
            <div className="space-y-2">
  <Label htmlFor="thumbnail">Thumbnail Image <span className="text-red-500">*</span></Label>
  <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={handleThumbnailUpload} required />

  {showCropper && thumbnailPreview && (
    <div>
      <div className="relative w-full h-[300px] bg-black">
        <Cropper
          image={thumbnailPreview}
          crop={crop}
          zoom={zoom}
          aspect={4 / 5}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, croppedArea) => setCroppedAreaPixels(croppedArea)}
        />
      </div>
      <button type="button" onClick={handleCropConfirm} className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded">
        Crop & Save
      </button>
    </div>
  )}

  {croppedImage && (
    <div className="mt-3">
      <div className="relative w-full rounded-md overflow-hidden" style={{ paddingBottom: "125%" }}> {/* 4:5 ratio */}
        <img
          src={croppedImage}
          alt="Cropped Thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover border"
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        <em>Final thumbnail preview (4:5 ratio)</em>
      </p>
    </div>
  )}
</div> 



            {/* Event Images */}
            <div className="space-y-2">
              <Label htmlFor="eventImages">Event Images (Max 5)</Label>
              <Input id="eventImages" name="eventImages" type="file" accept="image/*" multiple onChange={handleEventImagesUpload} />
              {eventImagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {eventImagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="h-20 w-20 rounded object-cover border" />
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. Networking, Tech, Free" />
            </div>

            {/* Contact */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact <span className="text-red-500">*</span></Label>
              <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Phone number" maxLength={10} />
            </div>

            {/* Credit To */}
<div className="space-y-2">
  <Label htmlFor="creditTo">Credit To</Label>
  <Input
    id="creditTo"
    name="creditTo"
    value={formData.creditTo || ''}
    onChange={handleChange}
    placeholder="Influencer's name or handle"
  />
</div>

{/* Verified Badge Toggle */}
<div className="space-y-2">
  <Label htmlFor="isVerified">
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="isVerified"
        name="isVerified"
        checked={formData.isVerified || false}
        onChange={handleChange}
      />
      <span>Verified Creator (Blue Tick)</span>
    </div>
  </Label>
</div>


            {/* Paid Option */}
            <div className="space-y-2">
              <Label htmlFor="isPaid">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="isPaid" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
                  <span>Is this a paid event?</span>
                </div>
              </Label>
            </div>

            {/* Paid Inputs */}
            {formData.isPaid && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price (INR) <span className="text-red-500">*</span></Label>
                  <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSeats">Max Seats <span className="text-red-500">*</span></Label>
                  <Input id="maxSeats" name="maxSeats" type="number" min="1" value={formData.maxSeats} onChange={handleChange} required />
                </div>
              </>
            )}

            {/* Upload Progress */}
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
          {uploading ? "Uploading..." : "Organize Event"}
        </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

