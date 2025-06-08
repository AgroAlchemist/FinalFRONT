import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="dashboard">
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

      {localStorage.getItem("role") === "farmer" && (
        <div
          className="my-crops-section"
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
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
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
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
      )}
    </div>
  );
};

export default Dashboard;
