import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CommunityHallPage = () => {
  const [halls, setHalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    minCapacity: "",
    maxCapacity: "",
  });

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "communityHalls"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setHalls(data);
      } catch (error) {
        console.error("Error fetching community halls:", error);
      }
    };

    fetchHalls();
  }, []);

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      // Search by name or location
      const matchesSearch =
        hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by location if selected
      const matchesLocation =
        !filters.location || hall.location.toLowerCase().includes(filters.location.toLowerCase());

      // Filter by min capacity if set
      const meetsMinCapacity =
        !filters.minCapacity || hall.capacity >= Number(filters.minCapacity);

      // Filter by max capacity if set
      const meetsMaxCapacity =
        !filters.maxCapacity || hall.capacity <= Number(filters.maxCapacity);

      return matchesSearch && matchesLocation && meetsMinCapacity && meetsMaxCapacity;
    });
  }, [halls, searchQuery, filters]);

  // Handler to update filters easily
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Book a Community Hall</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow p-6">
          <input
            type="text"
            placeholder="Search by name or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Filter by Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Minimum Capacity</label>
              <input
                type="number"
                name="minCapacity"
                placeholder="e.g., 50"
                value={filters.minCapacity}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md"
                min={0}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Maximum Capacity</label>
              <input
                type="number"
                name="maxCapacity"
                placeholder="e.g., 200"
                value={filters.maxCapacity}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md"
                min={0}
              />
            </div>
          </div>
        </div>

        {/* Community Hall List */}
        <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHalls.length > 0 ? (
            filteredHalls.map((hall) => (
              <Link
  to={`/community-hall/${hall.id}`}
  key={hall.id}
  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 block"
>
  {hall.images && hall.images.length > 0 ? (
  <img
    src={hall.images[0]}
    alt={`${hall.name} preview`}
    className="rounded-xl w-full h-64 object-cover mb-4"
  />
) : (
  <div className="w-full h-48 bg-gray-200 text-gray-600 flex items-center justify-center rounded-md mb-4 text-sm italic">
    No Image Available
  </div>
)}

  <h2 className="text-xl font-semibold mb-2">{hall.name}</h2>
  <p className="text-gray-700 mb-2">{hall.location}</p>
  <p className="text-gray-500 mb-4">Capacity: {hall.capacity}</p>

</Link>

            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No community halls found matching your criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityHallPage;
