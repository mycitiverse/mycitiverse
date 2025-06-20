import { useState } from 'react';
import { Input } from '../components/ui/Input'; // ✅ use correct relative path
import { Search } from 'lucide-react';

export default function SearchBar({ 
  placeholder = "Search...", 
  onSearch, 
  delay = 300 
}) {
  const [query, setQuery] = useState('');
  let timeoutId;

  const handleChange = (e) => {
    // ✅ Only allow letters and spaces
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setQuery(value);

    // Clear previous timeout
    clearTimeout(timeoutId);

    // Trigger search after delay
    timeoutId = setTimeout(() => {
      onSearch(value);
    }, delay);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 w-full"
      />
    </div>
  );
}
