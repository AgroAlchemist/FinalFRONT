import React, { useState } from "react";

const sourceColors = {
  organic: "#90EE90", // Light green for organic products
  conventional: "#F0F0F0", // Light gray for conventional products
};

const ProductCard = ({ product, showSeller = true }) => {
  const [showContact, setShowContact] = useState(false);
  const [farmerContact, setFarmerContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem("role");
  const farmerId = localStorage.getItem("farmerId");
  const {
    crop_name,
    price_per_unit,
    image_url,
    is_organic,
    farmer_name,
    farm_location,
    crop_id,
    farmer_id,
    quantity,
    unit,
    description,
  } = product;

  const bgColor = sourceColors[is_organic ? "organic" : "conventional"];
  const isOwner =
    role === "farmer" &&
    farmerId &&
    farmer_id &&
    farmerId === farmer_id.toString();

  // Trim description to 50 characters
  const trimmedDescription =
    description?.length > 50
      ? description.substring(0, 50) + "..."
      : description;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this crop listing?")) {
      try {
        const response = await fetch(`http://localhost:3000/crops/${crop_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting crop:", error);
      }
    }
  };

  const handleEdit = () => {
    window.location.href = `/edit-crop/${crop_id}`;
  };

  const handleContactClick = async () => {
    if (!localStorage.getItem("token")) {
      alert("Please login to contact the farmer");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/farmer/profile/${farmer_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFarmerContact(data);
        setShowContact(true);
      } else {
        alert("Failed to fetch farmer contact details");
      }
    } catch (error) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const defaultUserImage =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk_x_zUaCKM1ffaKKErUvIVKEwcDD_DWPBeg&s";
  const defaultFarmerImage =
    "https://img.freepik.com/free-vector/farmer-using-technology-digital-agriculture_53876-113813.jpg?semt=ais_hybrid";

  return (
    <div className="product-card" style={{ backgroundColor: bgColor }}>
      <img src={image_url} alt={crop_name} />
      <div className="product-info">
        <h3 title={crop_name}>{crop_name}</h3>
        <p className="price">
          ₹{price_per_unit} per {unit}
        </p>
        <p className="quantity">
          Available: {quantity} {unit}
        </p>
        {description && <p className="description">{trimmedDescription}</p>}
        {farmer_name && showSeller && (
          <p className="seller-info">
            Farmer: <span className="seller-name">{farmer_name}</span>
            <br />
            Location: {farm_location}
          </p>
        )}

        {/* Contact Button - Only show for non-owners */}
        {!isOwner && role !== "farmer" && (
          <button
            onClick={handleContactClick}
            disabled={loading}
            className="contact-btn"
          >
            {loading ? "Loading..." : "Contact Farmer"}
          </button>
        )}

        {/* Contact Modal */}
        {showContact && farmerContact && (
          <div className="contact-info">
            <h4>Contact Information</h4>
            <p>Name: {farmerContact.name}</p>
            <p>Phone: {farmerContact.phone}</p>
            <p>Email: {farmerContact.email}</p>
            <button onClick={() => setShowContact(false)}>Close</button>
          </div>
        )}

        {/* Show controls only if user is the owner */}
        {isOwner && (
          <div className="seller-controls">
            <button className="edit-btn" onClick={handleEdit}>
              Edit
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
