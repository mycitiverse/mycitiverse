import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";

export function EventCard({
  id,
  title,
  date,
  location,
  description,
  thumbnailUrl,
  category,
  price,
  onDelete,
  isUserEvent = false,
}) {
  return (
    <Link to={`/events/${id}`}>
      <Card className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300 block relative">
        <div className="w-full aspect-[4/5] bg-gray-200 rounded-t-lg overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Event Image
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-1">{title}</h2>

          <p className="text-gray-600 mb-1">
            📅 {new Date(date).toDateString()}
          </p>
          <p className="text-gray-600 mb-1">📍 {location}</p>
          <p className="text-gray-600 mb-1 line-clamp-2">📝 {description}</p>

          <div className="text-sm text-gray-600 mb-0">
            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
              {category || "Uncategorized"}
            </span>| <span className="inline-block text-green-600 font-medium">
            ₹{price || 0}
            </span>
          </div>

          {isUserEvent && (
            <button
              onClick={(e) => {
                e.preventDefault();
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
