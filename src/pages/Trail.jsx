import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Trail = () => {
  const [profile, setProfile] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");
        const farmerId = localStorage.getItem("farmerId");
        const userId = localStorage.getItem("userId");

        if (!token) {
          setError("Not authenticated");
          return;
        }

        // Determine the correct endpoint based on role
        const profileEndpoint =
          role === "farmer"
            ? `http://localhost:3000/farmer/profile/${farmerId}`
            : `http://localhost:3000/users/profile/${userId}`;

        const profileResponse = await fetch(profileEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await profileResponse.json();
        setProfile(profileData);

        // If user is a farmer, fetch their crops
        if (role === "farmer") {
          const cropsResponse = await fetch(
            `http://localhost:3000/crops/farmer/${farmerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!cropsResponse.ok) {
            throw new Error("Failed to fetch crops");
          }

          const cropsData = await cropsResponse.json();
          setCrops(cropsData);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []); // Empty dependency array for initial load

  const handleRecommendation = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/crops/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cropType: selectedCrop,
          soilType: soilType,
          season: season,
        }),
      });

      if (!response.ok) throw new Error("Failed to get recommendations");
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="dashboard" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Side - Profile and Recommendations */}
      <div style={{ flex: 1, padding: "20px", borderRight: "1px solid #ddd" }}>
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-image">
              <img
                src={
                  profile.profile_image ||
                  "https://img.freepik.com/free-vector/farmer-using-technology-digital-agriculture_53876-113813.jpg?semt=ais_hybrid"
                }
                alt={profile.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
            <div className="profile-info">
              <h2>Welcome, {profile.name}!</h2>
              <div className="profile-details">
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                {profile.location ? (
                  <p>
                    <strong>Farm Location:</strong> {profile.location}
                  </p>
                ) : (
                  <p>
                    <strong>Address:</strong> {profile.address}
                  </p>
                )}
                {profile.location && (
                  <p>
                    <strong>Experience:</strong>{" "}
                    {profile.farming_experience || "Not specified"} years
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Crop Recommendation System */}
        <div className="recommendation-section" style={{ marginTop: "30px" }}>
          <h3>Crop Recommendation System</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">Select Crop Type</option>
              <option value="rice">Rice</option>
              <option value="wheat">Wheat</option>
              <option value="corn">Corn</option>
              <option value="vegetables">Vegetables</option>
            </select>

            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">Select Soil Type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="silt">Silt</option>
            </select>

            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">Select Season</option>
              <option value="summer">Summer</option>
              <option value="winter">Winter</option>
              <option value="monsoon">Monsoon</option>
            </select>

            <button
              onClick={handleRecommendation}
              style={{
                padding: "10px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Get Recommendations
            </button>

            {recommendations.length > 0 && (
              <div
                className="recommendations-results"
                style={{ marginTop: "20px" }}
              >
                <h4>Recommended Crops:</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {recommendations.map((rec, index) => (
                    <li
                      key={index}
                      style={{
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        marginBottom: "5px",
                        borderRadius: "4px",
                      }}
                    >
                      {rec.name} - Success Rate: {rec.successRate}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - My Crops and Other Options */}
      <div style={{ flex: 1, padding: "20px" }}>
        {localStorage.getItem("role") === "farmer" && (
          <>
            <div className="my-crops-section">
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "#333",
                }}
              >
                My Listed Crops
              </h3>
              {crops.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <p>You haven't listed any crops yet</p>
                  <Link
                    to="/add-crop"
                    style={{
                      display: "inline-block",
                      marginTop: "10px",
                      padding: "8px 16px",
                      backgroundColor: "#28a745",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Add Your First Crop
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "20px",
                    padding: "20px",
                  }}
                >
                  {crops.map((crop) => (
                    <ProductCard
                      key={crop.crop_id}
                      product={crop}
                      showSeller={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="farmer-options" style={{ marginTop: "30px" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "20px",
                  color: "#333",
                }}
              >
                Farmer Options
              </h3>
              <div style={{ display: "grid", gap: "15px" }}>
                <Link
                  to="/add-crop"
                  className="option-card"
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>🌱 Add New Crop</span>
                </Link>
                <Link
                  to="/market-analysis"
                  className="option-card"
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>📊 Market Analysis</span>
                </Link>
                <Link
                  to="/weather-forecast"
                  className="option-card"
                  style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    textDecoration: "none",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>🌤️ Weather Forecast</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Trail;
