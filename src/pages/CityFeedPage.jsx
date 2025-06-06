import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Input } from "../components/ui/Input"
import Button from "../components/ui/Button"
import Badge from "../components/ui/badge"

function CityUpdateCard({ update, onClick, formatDate }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:shadow-md transition-shadow rounded-lg border border-gray-200 bg-white"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{update.title || "No Title Provided"}</CardTitle>

              <CardDescription className="text-sm mt-1 text-gray-500">
                {formatDate(update.createdAt)} • {update.location || "Unknown Location"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize text-sm">
              {update.category || "Uncategorized"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-3">
            {update.description || "No Description available."}
          </p>
          {update.imageUrl && (
            <img
              src={update.imageUrl}
              alt={update.title || "City update"}
              className="mt-4 rounded-md object-cover w-full h-48 border border-gray-300"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function CityFeedPage() {
  const navigate = useNavigate()
  const [updates, setUpdates] = useState([])
  const [filteredUpdates, setFilteredUpdates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])

  const categories = ['Meeting', 'Conference', 'Workshop', 'Social', 'Sports', 'Other']

  useEffect(() => {
    const q = query(collection(db, 'cityUpdates'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setUpdates(fetched)
      setFilteredUpdates(fetched)
    }, (err) => {
      console.error("Error fetching updates: ", err)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    let results = updates

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(update =>
        update.title?.toLowerCase().includes(term) ||
        update.description?.toLowerCase().includes(term) ||
        update.location?.toLowerCase().includes(term)
      )
    }

    if (selectedCategories.length > 0) {
      results = results.filter(update =>
        selectedCategories.includes(update.category)
      )
    }

    setFilteredUpdates(results)
  }, [searchTerm, selectedCategories, updates])

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
  }

  const formatDate = (createdAt) => {
    if (!createdAt) return ""
    const date = createdAt.toDate?.() || new Date(createdAt)
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">City Feed: Local Updates & Announcements</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <Input
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6"
          />

          <Card>
            <CardHeader>
              <CardTitle>Filter by Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <p className="mb-4 text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredUpdates.length}</span> of{" "}
            <span className="font-semibold">{updates.length}</span> updates
          </p>

          {filteredUpdates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUpdates.map(update => (
                <CityUpdateCard
                  key={update.id}
                  update={update}
                  onClick={() => navigate(`/city-feed/${update.id}`)}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-xl font-medium">No updates found</h3>
              <p>Try adjusting your search or filters</p>
              {selectedCategories.length > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
