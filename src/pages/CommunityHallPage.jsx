import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CommunityHallPage = () => {
  const [halls, setHalls] = useState([]);
  const [uniqueCities, setUniqueCities] = useState([]);
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
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedData = data.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        );

        // Extract unique city names
        const cities = [...new Set(sortedData.map((hall) => hall.location))];
        setUniqueCities(cities);
        setHalls(sortedData);
      } catch (error) {
        console.error("Error fetching community halls:", error);
      }
    };

    fetchHalls();
  }, []);

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      const matchesSearch =
        hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        !filters.location ||
        hall.location.toLowerCase().includes(filters.location.toLowerCase());

      const meetsMinCapacity =
        !filters.minCapacity || hall.capacity >= Number(filters.minCapacity);

      const meetsMaxCapacity =
        !filters.maxCapacity || hall.capacity <= Number(filters.maxCapacity);

      return (
        matchesSearch && matchesLocation && meetsMinCapacity && meetsMaxCapacity
      );
    });
  }, [halls, searchQuery, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Book a Community Hall
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Panel */}
        <div>
          <label className="block mb-1 font-medium">
            Search by Name or Location
          </label>
          <input
            type="text"
            placeholder="Search by name or location"
            value={searchQuery}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />

          <div className="space-y-4">
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block mb-1 font-medium"
              >
                Filter by Location
              </label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Minimum Capacity</label>
              <input
                type="number"
                name="minCapacity"
                placeholder="e.g. 50"
                value={filters.minCapacity}
                onChange={handleFilterChange}
                onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
                className="w-full px-3 py-2 border rounded-md"
                min={0}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Maximum Capacity</label>
              <input
                type="number"
                name="maxCapacity"
                placeholder="e.g. 200"
                value={filters.maxCapacity}
                onChange={handleFilterChange}
                onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
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
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-300 block"
              >
                {hall.thumbnail || (hall.images && hall.images.length > 0) ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
  <img
    src={hall.thumbnail || hall.images[0]}
    alt={hall.name}
    className="absolute inset-0 w-full h-full object-cover"
  />
</div>

                ) : (
                  <div className="w-full h-48 bg-gray-200 text-gray-600 flex items-center justify-center rounded-md mb-4 text-sm italic">
                    No Thumbnail Available
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-1">{hall.name}</h2>
                <p className="text-gray-700 mb-1">
                  📍 Location: <b>{hall.location}</b>
                </p>
                <p className="text-gray-600 mb-1">
                  👥 Capacity: <b>{hall.capacity}</b>
                </p>
                <p className="text-gray-600 mb-1">
                  💰 Price/Plate:{" "}
                  <span className="text-green-600 font-medium">
                    ₹{hall.pricePerPlate}
                  </span>
                </p>
                <p
                  className={`${
                    hall.availability === "Available"
                      ? "text-green-600"
                      : "text-red-500"
                  } font-semibold`}
                >
                  {hall.availability}
                </p>
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
