import { useState, useEffect } from 'react'
import Button from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import Textarea from "../components/ui/Textarea"
import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function AddCityUpdate() {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    imageUrl: '',
    location: ''
  })

  useEffect(() => {
    if (!currentUser) {
      window.location.href = "/login"
    }
  }, [currentUser])

  const categories = [
    'Meeting',
    'Conference',
    'Workshop',
    'Social',
    'Sports',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await addDoc(collection(db, 'cityUpdates'), {
        ...formData,
        createdAt: Timestamp.now()
      })

      alert('City update saved successfully!')
      setFormData({
        title: '',
        category: '',
        description: '',
        imageUrl: '',
        location: ''
      })
    } catch (error) {
      console.error("Error saving update: ", error)
      alert("Failed to save city update.")
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add City Update</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter update title"
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

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter detailed description"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter location or address"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" className="w-full">
            Submit Update
          </Button>
        </div>
      </form>

      {formData.imageUrl && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Image Preview</h3>
          <div className="border rounded-md overflow-hidden">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/200x200?text=No+Image'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
