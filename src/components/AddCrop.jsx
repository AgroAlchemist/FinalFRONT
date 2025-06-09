import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCrop = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    crop_name: "",
    quantity: "",
    unit: "kg", // default unit
    price_per_unit: "",
    description: "",
    harvest_date: "",
    image_url: "",
    is_organic: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3000/crops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Crop listed successfully!");
        setTimeout(() => navigate("/crops"), 1500);
      } else {
        setMessage(`❌ ${data.error || "Failed to add crop"}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <div className="add-crop-form">
      <h2>List New Product for Sale</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name:</label>
          <input
            type="text"
            name="crop_name"
            value={formData.crop_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Unit:</label>
          <select name="unit" value={formData.unit} onChange={handleChange}>
            <option value="kg">Kilogram (kg)</option>
            <option value="quintal">Quintal</option>
            <option value="ton">Ton</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price per Unit (₹):</label>
          <input
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Harvest Date or Manufacturing Date:</label>
          <input
            type="date"
            name="harvest_date"
            value={formData.harvest_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="is_organic"
              checked={formData.is_organic}
              onChange={handleChange}
            />
            Organic Product
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "List Product"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddCrop;
