import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import Button from "../components/ui/Button";
import { getUserEvents } from '../utils/storage';

const mockEvents = [
  {
    id: '1',
    title: 'Tech Conference 2023',
    description: 'Annual technology conference featuring the latest innovations in software development, AI, and cloud computing.',
    date: '2023-11-15',
    time: '09:00 AM - 05:00 PM',
    location: 'Convention Center, San Francisco',
    category: 'Workshops',
    imageUrl: '/tech-conference.jpg'
  },
  {
    id: '2',
    title: 'Music Festival',
    description: 'Three-day outdoor music festival featuring top artists from around the world.',
    date: '2023-12-10',
    time: '12:00 PM - 11:00 PM',
    location: 'Central Park, New York',
    category: 'Music',
    imageUrl: '/music-festival.jpg'
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    description: 'Experience gourmet food and fine wines from local and international vendors.',
    date: '2023-10-20',
    time: '10:00 AM - 08:00 PM',
    location: 'Downtown Expo Hall, Chicago',
    category: 'Workshops',
    imageUrl: '/food-expo.jpg'
  }
];

export default function EventDetails() {
  const { eventId } = useParams(); // get ID from URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEvents = getUserEvents();
    const allEvents = [...mockEvents, ...userEvents];
    const foundEvent = allEvents.find(e => String(e.id) === eventId);

    setTimeout(() => {
      setEvent(foundEvent || null);
      setLoading(false);
    }, 300); // simulate delay
  }, [eventId]);

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
                      day: 'numeric'
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
