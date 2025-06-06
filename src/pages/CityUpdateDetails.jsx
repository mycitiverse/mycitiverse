import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import Button from "../components/ui/Button"
import Badge from "../components/ui/badge"

export default function CityUpdateDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [update, setUpdate] = useState(null)

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const docRef = doc(db, 'cityUpdates', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setUpdate({ id: docSnap.id, ...docSnap.data() })
        } else {
          setUpdate(null)
        }
      } catch (error) {
        console.error("Error fetching city update:", error)
        setUpdate(null)
      }
    }

    fetchUpdate()
  }, [id])

  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = timestamp.toDate?.() || new Date(timestamp)
    return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  }

  if (!update) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold mb-2">Update Not Found</h2>
        <p className="text-muted-foreground">We couldn't find any city update with ID: {id}</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        ← Back to Feed
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{update.title || "Untitled Update"}</CardTitle>
          <CardDescription className="text-sm mt-1">
            {formatDate(update.createdAt)} • {update.location || "Unknown Location"}
          </CardDescription>
          <Badge className="capitalize mt-2">{update.category}</Badge>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4">
            {update.description || "No description available."}
          </p>

          {update.imageUrl && (
            <div className="rounded-md overflow-hidden border">
              <img
                src={update.imageUrl}
                alt={update.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image"
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
