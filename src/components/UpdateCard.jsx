import { MapPin, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "/components/ui/card"
import { Badge } from "/components/ui/badge"

export default function CityUpdateCard({ update }) {
  const safeUpdate = update || {
    id: '',
    title: 'Untitled Update',
    description: 'No description available',
    category: 'other',
    location: 'Location not specified',
    imageUrl: undefined
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {safeUpdate.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={safeUpdate.imageUrl}
            alt={safeUpdate.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,...'
            }}
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-2">{safeUpdate.title}</CardTitle>
          <Badge variant="outline" className="shrink-0 capitalize">
            {safeUpdate.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{safeUpdate.location}</span>
          </div>
          {safeUpdate.date && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(safeUpdate.date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <CardDescription className="line-clamp-3">
          {safeUpdate.description}
        </CardDescription>
        
        <button className="text-sm font-medium text-primary hover:underline mt-2">
          Read more
        </button>
      </CardContent>
    </Card>
  )
}
