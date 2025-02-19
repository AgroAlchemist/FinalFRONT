import { useState } from "react";
import axios from "axios";

const RentalForm = ({ fetchRentals }) => {
  const [form, setForm] = useState({
    owner_id:
      localStorage.getItem("userId") || localStorage.getItem("farmerId"),
    name: "",
    description: "",
    price_per_day: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:3000/rental/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        // Ensure successful response
        setMessage("✅ Rental added successfully!");
        fetchRentals(); // Refresh rentals list

        // Reset form after successful submission
        setForm({
          owner_id:
            localStorage.getItem("userId") || localStorage.getItem("farmerId"),
          name: "",
          description: "",
          price_per_day: "",
          location: "",
        });
      } else {
        setMessage("❌ Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error adding rental:", error);
      setMessage("❌ Failed to add rental.");
    } finally {
      setLoading(false); // ✅ Ensure loading is stopped
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setMessage("");

  //   try {
  //     await axios.post("http://localhost:3000/rental/create", form, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     setMessage("✅ Rental added successfully!");
  //     fetchRentals();
  //     setForm({
  //       owner_id:
  //         localStorage.getItem("userId") || localStorage.getItem("farmerId"),
  //       name: "",
  //       description: "",
  //       price_per_day: "",
  //       location: "",
  //     });
  //   } catch (error) {
  //     console.error("Error adding rental:", error);
  //     setMessage("❌ Failed to add rental.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="add-rental-form p-4 border rounded shadow-md">
      <h1 className="text-xl font-bold mb-4">Add Property for Rent</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="block mb-1">Product Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="form-group">
          <label className="block mb-1">Description:</label>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="form-group">
          <label className="block mb-1">Price Per Day:</label>
          <input
            type="number"
            name="price_per_day"
            placeholder="Price Per Day"
            value={form.price_per_day}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <div className="form-group">
          <label className="block mb-1">Location:</label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Rental"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default RentalForm;
