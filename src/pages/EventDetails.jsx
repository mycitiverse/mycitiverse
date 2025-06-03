import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import Button from "../components/ui/Button";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveViewedCategory } from "../firebaseUsers";

export default function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  console.log("Logged in user:", currentUser?.uid);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = { id: docSnap.id, ...docSnap.data() };
          setEvent(eventData);

          // ✅ Save viewed category
          if (currentUser && eventData.category) {
            // use .then() because we cannot use 'await' directly in useEffect's inner scope
            saveViewedCategory(currentUser.uid, eventData.category)
              .then(() => console.log("Category saved"))
              .catch((err) => console.error("Error saving category:", err));
          }
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{event.title}</CardTitle>
          <CardDescription className="text-lg">{event.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={event.imageUrl || 'https://via.placeholder.com/600x300.png?text=Event+Image'}
                alt={event.title}
                className="rounded-xl w-full h-64 object-cover mb-4"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date & Time</p>
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    <br />
                    {event.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Tag className="mr-2 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Category</p>
                  <p className="text-muted-foreground">{event.category}</p>
                </div>
              </div>

              <Button className="w-full">Register for Event</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
