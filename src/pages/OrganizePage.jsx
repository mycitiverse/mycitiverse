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

export default function OrganizePage() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    imageFiles: [],
    isPaid: false,
    price: 0,
    maxSeats: 0,
    tags: '',
    contact: '',
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
  if (!currentUser) {
    window.location.href = "/login";
  } else {
    setUser(currentUser);
  }
}, [currentUser]);


  const categories = ['Meeting', 'Conference', 'Workshop', 'Social', 'Sports', 'Other'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const previews = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, imageFiles: files }));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (!user?.email) {
      alert("User email not found. Please log in again.");
      return;
    }

    try {
      // You would typically upload these files to Firebase Storage here
      const imageUrls = formData.imageFiles.map((file, index) => `Image-${index + 1}.jpg`);

      await addDoc(collection(db, "events"), {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        imageUrls,
        isPaid: formData.isPaid,
        price: formData.isPaid ? Number(formData.price) : 0,
        maxSeats: formData.isPaid ? Number(formData.maxSeats) : 0,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        contact: formData.contact,
        bookedUsers: [],
        createdAt: Timestamp.now(),
        createdBy: user.email
      });

      alert("Event saved successfully!");

      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        imageFiles: [],
        isPaid: false,
        price: 0,
        maxSeats: 0,
        tags: '',
        contact: '',
      });
      setImagePreviews([]);
    } catch (error) {
      console.error("Error adding event to Firestore:", error);
      alert("Failed to save event. Try again.");
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
              <Label htmlFor="title">Event Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
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

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="images">Upload Images (Max 5)</Label>
              <Input id="images" name="images" type="file" accept="image/*" multiple onChange={handleImageUpload} />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {imagePreviews.map((src, idx) => (
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

            {/* Contact Info */}
            <div className="space-y-2">
              <Label htmlFor="contact">Contact (Email or Phone)</Label>
              <Input id="contact" name="contact" value={formData.contact} onChange={handleChange} placeholder="Optional" />
            </div>

            {/* Paid Event */}
            <div className="space-y-2">
              <Label htmlFor="isPaid">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="isPaid" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
                  <span>Is this a paid event?</span>
                </div>
              </Label>
            </div>

            {formData.isPaid && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price (INR)</Label>
                  <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSeats">Max Seats</Label>
                  <Input id="maxSeats" name="maxSeats" type="number" min="1" value={formData.maxSeats} onChange={handleChange} required />
                </div>
              </>
            )}

            {/* Submit */}
            <div className="pt-4">
              <Button type="submit" className="w-full">Save Event</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
