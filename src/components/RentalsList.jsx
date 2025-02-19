import { useState, useEffect } from "react";
import axios from "axios";

const RentalsList = () => {
  const [rentals, setRentals] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all available locations
  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from storage

      const res = await axios.get("http://localhost:3000/rental/locations", {
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
        },
      });

      setLocations(res.data);
      console.log(res.data);

      if (res.data.length > 0) {
        setSelectedLocation(res.data[0]); // Default to the first location
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Failed to load locations.");
    }
  };

  // Fetch rentals based on selected location

  const fetchRentals = async (location) => {
    if (!location) {
      setError("Invalid location selected.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token"); // Retrieve token from storage

      const res = await axios.get(
        `http://localhost:3000/rental/all`, // No need for trailing slash
        {
          params: { location }, // ✅ Correct way to send query parameters
          headers: {
            Authorization: `Bearer ${token}`, // Include auth token
          },
        }
      );

      setRentals(res.data[0]);
      console.log("Fetched Rentals:", res.data);
    } catch (error) {
      console.error("Error fetching rentals:", error);

      if (error.response) {
        setError(error.response.data.message || "Failed to fetch rentals.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) fetchRentals(selectedLocation);
  }, [selectedLocation]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Available Rentals</h2>

      {/* Location Dropdown */}
      <label className="block mb-2 font-bold">Select Location:</label>
      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        {locations.map((loc, index) => (
          <option key={index} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      {loading && <p>Loading rentals...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-2">
        {rentals.map((rental) => (
          <li
            key={rental.id}
            className="p-3 border rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{rental.name}</h3>
              <p>{rental.description}</p>
              <p>
                <strong>Price:</strong> Rs. {rental.price_per_day}/day
              </p>
              <p>
                <strong>Location:</strong> {rental.location}
              </p>
            </div>
            {/* <button
              onClick={() => deleteRental(rental.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RentalsList;
