import { useState, useEffect } from 'react'
import Button from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import Textarea from "../components/ui/Textarea"
import { Label } from "../components/ui/Label"
import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function OrganizePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    imageUrl: ''
  });

  // Redirect to login if user not found
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) window.location.href = "/login"
  }, [])

  const categories = [
    'Meeting',
    'Conference',
    'Workshop',
    'Social',
    'Sports',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        ...formData,
        createdAt: Timestamp.now()
      });

      alert("Event saved successfully!");

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: '',
        imageUrl: ''
      });
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
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter event location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select.Root
                value={formData.category}
                onValueChange={handleCategoryChange}
              >
                <Select.Trigger
                  id="category"
                  aria-label="Category"
                  className="inline-flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white text-sm"
                >
                  <Select.Value placeholder="Select a category" />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content
                    className="overflow-hidden bg-white rounded-md border shadow-md"
                    position="popper"
                    sideOffset={5}
                  >
                    <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>

                    <Select.Viewport className="p-2">
                      {categories.map((category) => (
                        <Select.Item
                          key={category}
                          value={category}
                          className="relative flex items-center px-8 py-2 text-sm text-gray-700 cursor-pointer select-none hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <Select.ItemText>{category}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>

                    <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-100 cursor-default">
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full">
                Save Event
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
