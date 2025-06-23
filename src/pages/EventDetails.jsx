import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../components/ui/Button";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { saveViewedCategory } from "../firebaseUsers";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const eventData = { id: docSnap.id, ...docSnap.data() };
          setEvent(eventData);

          if (currentUser && eventData.category) {
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
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

       const galleryImages = Array.isArray(event.eventImageUrls) ? event.eventImageUrls : [];
       const lightboxSlides = galleryImages.map((url) => ({ src: url }));

      const isPartneredCreator =
      event.creditTo?.toLowerCase().includes("mycitiverse") || false;

  return (
  <div className="max-w-5xl mx-auto px-4 py-8">
    <Button
      onClick={() => navigate(`/events`)}
      className="mb-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow"
    >
      ← Back to List
    </Button>

    <h1 className="text-4xl font-bold text-gray-800 mb-2">{event.title}</h1>
    <p className="text-gray-600 mb-4 text-lg">{event.description}</p>

    <div className="text-lg text-gray-700 space-y-1 mb-2">
        <p>📍 <strong>Location:</strong> {event.location}</p>
        <p>📌 <strong>Full Address:</strong> {event.fullAddress} |
        🗺️ <strong>Map:</strong> <a href={event.googleMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View on Google Maps</a></p>
        <p>📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        })} |
        ⏰ <strong>Time:</strong> {event.time} |
        🏷️ <strong>Category:</strong> {event.category} |
        💵 <strong>Price:</strong> {event.price > 0 ? `₹${event.price}` : "Free"} </p>
        {event.maxSeats > 0 && <p>🪑 <strong>Max Seats:</strong> {event.maxSeats} </p>}
        <p>📞 <strong>Contact:</strong> {event.contact} |
        🔖 <strong>Tags:</strong> {event.tags?.length > 0 ? event.tags.join(", ") : "None"}</p>
        <p>👤 <strong>Creator:</strong> {event.creditTo || "Anonymous"}
          {isPartneredCreator && (
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">MyCitiverse Partner</span>
          )}
          {event.isVerified && (
            <span className="ml-2 text-blue-500">✔️</span>
          )}
        </p>
      </div>

    {/* Image Gallery */}
    {galleryImages.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {galleryImages.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`img ${index + 1}`}
            className="rounded-lg shadow-md w-full h-60 object-cover cursor-zoom-in"
            onClick={() => {
              setSelectedIndex(index);
              setLightboxOpen(true);
            }}
          />
        ))}
      </div>
    ) : (
      <div className="mb-8 bg-gray-200 text-center text-gray-600 py-10 rounded-lg">
        No images available
      </div>
    )}

    {/* Lightbox Viewer */}
    {lightboxOpen && (
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={selectedIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
      />
    )}

    <button
      onClick={() => navigate(`/book-event/${eventId}`)}
      className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md transition"
    >
      📅 Register for Event
    </button>
  </div>
);
}