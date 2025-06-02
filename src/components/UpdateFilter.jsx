import { useState } from 'react'
import Button from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Label } from "../components/ui/Label"
import * as Select from '@radix-ui/react-select';

export default function UpdateFilter({ onFilterChange }) {
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const handleFilterChange = () => {
    onFilterChange({
      category,
      location,
      date,
    })
  }

  const clearFilters = () => {
    setCategory('')
    setLocation('')
    setDate('')
    onFilterChange({
      category: '',
      location: '',
      date: '',
    })
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filter Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="category" className="block mb-2">
            Category
          </Label>
          <Select.Root value={category} onValueChange={setCategory}>
  <Select.Trigger className="w-full px-3 py-2 border rounded">
    <Select.Value placeholder="Select a category" />
  </Select.Trigger>
  <Select.Content className="bg-white border rounded shadow-md">
    <Select.Item value="music" className="px-3 py-2 cursor-pointer hover:bg-gray-100">Music</Select.Item>
    <Select.Item value="food" className="px-3 py-2 cursor-pointer hover:bg-gray-100">Food & Drink</Select.Item>
    <Select.Item value="workshop" className="px-3 py-2 cursor-pointer hover:bg-gray-100">Workshop</Select.Item>
    <Select.Item value="sports" className="px-3 py-2 cursor-pointer hover:bg-gray-100">Sports</Select.Item>
    <Select.Item value="art" className="px-3 py-2 cursor-pointer hover:bg-gray-100">Art & Culture</Select.Item>
  </Select.Content>
</Select.Root>

        </div>

        <div>
          <Label htmlFor="location" className="block mb-2">
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="Enter a city"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="date" className="block mb-2">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
        <Button onClick={handleFilterChange}>Apply Filters</Button>
      </div>
    </div>
  )
}
