import { useState, useEffect } from 'react';
import { Label } from "/components/ui/label";
import { Checkbox } from "/components/ui/Checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";

export default function Filters({ onChange }) {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const categories = ['Music', 'Sports', 'Workshops', 'Festivals'];

  const handleCheckboxChange = (category) => {
    setSelectedFilters((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    if (onChange) {
      onChange(selectedFilters);
    }
  }, [selectedFilters, onChange]);

  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardTitle className="text-lg">Filter Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={`filter-${category.toLowerCase()}`}
              checked={selectedFilters.includes(category)}
              onCheckedChange={() => handleCheckboxChange(category)}
            />
            <Label htmlFor={`filter-${category.toLowerCase()}`}>
              {category}
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Default onChange handler if not provided
Filters.defaultProps = {
  onChange: () => {},
};
