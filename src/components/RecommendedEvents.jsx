import React, { useEffect, useState } from "react";
import { EventCard } from "./EventCard"; // reuse your existing card

export default function RecommendedEvents({ allEvents, userCategories }) {
  const [recommendedEvents, setRecommendedEvents] = useState([]);

  // 🧠 Step 2: Filter & rank events
  useEffect(() => {
    if (!userCategories.length || !allEvents.length) return;

    const interestCounts = {};
    userCategories.forEach((cat) => {
      interestCounts[cat] = (interestCounts[cat] || 0) + 1;
    });

    const sortedCategories = Object.keys(interestCounts).sort(
      (a, b) => interestCounts[b] - interestCounts[a]
    );

    const filtered = allEvents
      .filter((event) => sortedCategories.includes(event.category))
      .sort((a, b) => {
        // Prioritize events based on how often the category is viewed
        return (
          interestCounts[b.category] - interestCounts[a.category]
        );
      });

    setRecommendedEvents(filtered);
  }, [userCategories, allEvents]);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
      {recommendedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No personalized recommendations yet. Start exploring events!</p>
      )}
    </div>
  );
}
