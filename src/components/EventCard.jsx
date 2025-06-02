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
          <p className="text-gray-500 mb-1">{date}</p>
          <p className="text-gray-500 mb-4">{location}</p>
          <p className="text-gray-700 mb-6">{description}</p>
          {isUserEvent && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent card click navigation
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
