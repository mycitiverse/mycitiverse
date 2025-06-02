import { useState, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Input } from "../components/ui/Input"
import Button from "../components/ui/Button"
import Badge from "../components/ui/badge"

export default function CityFeedPage() {
  const [updates, setUpdates] = useState([])
  const [filteredUpdates, setFilteredUpdates] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Available categories (should match what's used in AddCityUpdate)
  const categories = ['news', 'event', 'construction', 'alert', 'other']

  // Load updates from localStorage
  useEffect(() => {
    const storedUpdates = JSON.parse(localStorage.getItem('cityUpdates') || '[]')
    setUpdates(storedUpdates)
    setFilteredUpdates(storedUpdates)
  }, [])

  // Apply filters whenever search term or categories change
  useEffect(() => {
    let results = updates
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      results = results.filter(update => 
        update.title.toLowerCase().includes(term) || 
        update.description.toLowerCase().includes(term) ||
        update.location.toLowerCase().includes(term)
      )
    }
    
    // Apply category filter
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">City Updates Feed</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </Button>
          {selectedCategories.length > 0 && (
            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
              Clear filters
              <X size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isFilterOpen && (
          <div className="p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredUpdates.length} of {updates.length} updates
      </div>

      {/* Updates feed */}
      {filteredUpdates.length > 0 ? (
        <div className="space-y-6">
          {filteredUpdates.map(update => (
            <Card key={update.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{update.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {formatDate(update.createdAt)} • {update.location}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {update.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{update.description}</p>
                  
                  {update.imageUrl && (
                    <div className="mt-4 rounded-md overflow-hidden border">
                      <img 
                        src={update.imageUrl} 
                        alt={update.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18d8e6b8e9a%20text%20%7B%20fill%3A%23AAAAAA%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18d8e6b8e9a%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23EEEEEE%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2274.0859375%22%20y%3D%22104.5%22%3E200x200%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E'
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No updates found</h3>
          <p className="text-muted-foreground max-w-md">
            {updates.length === 0 
              ? "No city updates have been submitted yet." 
              : "Try adjusting your search or filters."}
          </p>
          {selectedCategories.length > 0 && (
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}