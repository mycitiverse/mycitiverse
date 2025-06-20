import { useState, useEffect } from "react";
import { Label } from "../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Filters({ onChange }) {
  const categories = ["Music", "Sports", "Workshops", "Festivals"];
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (onChange) {
      onChange(selectedCategory);
    }
  }, [selectedCategory, onChange]);

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="text-lg">Filter Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="category" className="block mb-1 font-medium">
            Category
          </Label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

// Default onChange handler
Filters.defaultProps = {
  onChange: () => {},
};
