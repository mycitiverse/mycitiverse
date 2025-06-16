import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";

export function EventCard({
  id,
  title,
  date,
  location,
  description,
  imageUrl,
  category,
  price,
  onDelete,
  isUserEvent = false,
}) {
  return (
    <Link to={`/events/${id}`}>
      <Card className="h-full relative cursor-pointer hover:shadow-lg transition">
        <div className="h-48 bg-gray-200 border-2 border-dashed rounded-t-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Event Image
            </div>
          )}
        </div>

        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-500 text-sm mb-1">
            📅 {new Date(date).toDateString()}
          </p>
          <p className="text-gray-500 text-sm mb-1">📍 {location}</p>
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">{description}</p>

          {/* Show Category and Price */}
          <div className="text-sm text-gray-600 mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
              {category || "Uncategorized"}
            </span>
            <span className="inline-block text-green-600 font-medium">
              ₹{price || 0}
            </span>
          </div>

          {/* Book Event Button (for visual clarity) */}
          <div className="mt-4">
            <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
              Book Event
            </span>
          </div>

          {/* Optional delete button for user events */}
          {isUserEvent && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                onDelete(id);
              }}
              className="absolute top-2 right-2 text-sm text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
