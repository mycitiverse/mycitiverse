import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Filter } from 'lucide-react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Input } from "../components/ui/Input"
import Button from "../components/ui/Button"
import Badge from "../components/ui/badge"

// Dedicated component for each update card
function CityUpdateCard({ update, onClick, formatDate }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg border border-gray-200 bg-white"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold">{update.title || "No Title Provided"}</CardTitle>
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
          <p className="text-gray-600">{update.description || "No Description available."}</p>
          {update.imageUrl && (
            <div className="mt-4 rounded-md overflow-hidden border border-gray-300">
              <img
                src={update.imageUrl}
                alt={update.title || "City update"}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                }}
              />
            </div>
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)

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
    <div className="container mx-auto px-6 py-10 max-w-5xl">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          City Updates Feed
        </h1>
        <p className="text-lg text-gray-600">
          Stay informed with the latest happenings, events, and news from around your city.
        </p>
      </header>

      {/* Controls: Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </Button>
          {selectedCategories.length > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
              Clear filters
              <X size={18} />
            </Button>
          )}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="p-5 border border-gray-300 rounded-lg bg-gray-50 mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
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
        </div>
      )}

      {/* Updates count */}
      <p className="mb-6 text-sm text-gray-600">
        Showing <span className="font-semibold">{filteredUpdates.length}</span> of <span className="font-semibold">{updates.length}</span> updates
      </p>

      {/* Updates List */}
      {filteredUpdates.length > 0 ? (
        <div className="space-y-8">
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search size={60} className="text-gray-300 mb-6" />
          <h3 className="text-2xl font-semibold mb-2 text-gray-700">No updates found</h3>
          <p className="max-w-md text-gray-500 mb-4">
            {updates.length === 0
              ? "No city updates have been submitted yet."
              : "Try adjusting your search or filters."}
          </p>
          {selectedCategories.length > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
