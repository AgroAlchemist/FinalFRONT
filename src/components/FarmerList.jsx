import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const defaultFarmerImage =
  "https://img.freepik.com/free-vector/farmer-using-technology-digital-agriculture_53876-113813.jpg?semt=ais_hybrid";

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await fetch("http://localhost:3000/farmer/all");
        const data = await response.json();

        if (response.ok) {
          setFarmers(data);
        } else {
          setError(data.error || "Failed to fetch farmers");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "2rem",
          color: "#333",
        }}
      >
        Our Farmers
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {farmers.map((farmer) => (
          <div
            key={farmer.farmer_id}
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              cursor: "pointer",
              ":hover": {
                transform: "translateY(-5px)",
              },
            }}
          >
            <img
              src={farmer.profile_image || defaultFarmerImage}
              alt={farmer.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            />
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "10px",
                color: "#333",
              }}
            >
              {farmer.name}
            </h3>
            <p
              style={{
                color: "#666",
                marginBottom: "15px",
              }}
            >
              Location: {farmer.location}
            </p>
            <Link
              to={`/farmer/profile/${farmer.farmer_id}`}
              style={{
                display: "inline-block",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                transition: "background-color 0.2s",
                ":hover": {
                  backgroundColor: "#218838",
                },
              }}
            >
              View Crops
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmerList;
