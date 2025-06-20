import { useState, useEffect } from 'react';
import Button from "../components/ui/Button";
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

export default function OrganizePage() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    thumbnail: null,
    eventImages: [],
    isPaid: false,
    price: 0,
    maxSeats: 0,
    tags: '',
    contact: '',
  });

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

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
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
      const eventImageUrls = await Promise.all(
        formData.eventImages.map(file => uploadToCloudinary(file))
      );
      setUploadProgress(90);

      // Save to Firestore
      await addDoc(collection(db, "events"), {
        ...formData,
        thumbnailUrl,
        eventImageUrls,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        price: formData.isPaid ? Number(formData.price) : 0,
        maxSeats: formData.isPaid ? Number(formData.maxSeats) : 0,
        bookedUsers: [],
        createdAt: Timestamp.now(),
        createdBy: user.email
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
        category: '',
        thumbnail: null,
        eventImages: [],
        isPaid: false,
        price: 0,
        maxSeats: 0,
        tags: '',
        contact: '',
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
        <CardHeader>
          <CardTitle className="text-2xl">Organize an Event</CardTitle>
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

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image <span className="text-red-500">*</span></Label>
              <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" onChange={handleThumbnailUpload} required />
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-20 w-20 rounded object-cover border mt-2" />
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
              <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                <div className="bg-yellow-500 h-3 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? "Uploading..." : "Save Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
