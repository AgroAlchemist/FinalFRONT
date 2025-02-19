import { useState, useEffect } from "react";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    soil_type: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [recommendation, setRecommendation] = useState(null);
  const [previousRecommendations, setPreviousRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch previous recommendations on component mount
  useEffect(() => {
    const fetchPreviousRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/farmer/crop-recommendation/${localStorage.getItem(
            "farmerId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setPreviousRecommendations(data);
        } else {
          console.error("Failed to fetch previous recommendations");
        }
      } catch (err) {
        console.error("Error fetching previous recommendations:", err);
      }
    };

    fetchPreviousRecommendations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/farmer/crop-recommendation/${localStorage.getItem(
          "farmerId"
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRecommendation(data);
        // Add new recommendation to previous recommendations
        setPreviousRecommendations((prev) => [data, ...prev]);
      } else {
        setError(data.error || "Failed to get recommendation");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="crop-recommendation-container">
      <div className="recommendation-form">
        <h2>Get New Crop Recommendation</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Soil Type:</label>
            <select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Soil Type</option>
              <option value="clay">Clay</option>
              <option value="sandy">Sandy</option>
              <option value="loamy">Loamy</option>
              <option value="black">Black</option>
              <option value="red">Red</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nitrogen (N):</label>
            <input
              type="number"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              required
              min="0"
              max="140"
            />
          </div>

          <div className="form-group">
            <label>Phosphorus (P):</label>
            <input
              type="number"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleChange}
              required
              min="0"
              max="145"
            />
          </div>

          <div className="form-group">
            <label>Potassium (K):</label>
            <input
              type="number"
              name="potassium"
              value={formData.potassium}
              onChange={handleChange}
              required
              min="0"
              max="205"
            />
          </div>

          <div className="form-group">
            <label>Temperature (°C):</label>
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
              min="0"
              max="50"
            />
          </div>

          <div className="form-group">
            <label>Humidity (%):</label>
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              required
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>pH:</label>
            <input
              type="number"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              required
              min="0"
              max="14"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <label>Rainfall (mm):</label>
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              required
              min="0"
              max="300"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Getting Recommendation..." : "Get Recommendation"}
          </button>
        </form>
      </div>

      {recommendation && (
        <div className="new-recommendation">
          <h3>New Recommendation</h3>
          <div className="recommendation-card highlight">
            <p className="recommended-crop">
              {recommendation.recommended_crop}
            </p>
            <p className="recommendation-date">
              Generated on: {formatDate(new Date())}
            </p>
            <div className="soil-conditions">
              <p>Soil Type: {formData.soil_type}</p>
              <p>
                N-P-K: {formData.nitrogen}-{formData.phosphorus}-
                {formData.potassium}
              </p>
              <p>pH: {formData.ph}</p>
            </div>
          </div>
        </div>
      )}
      <div className="previous-recommendations">
        <h3>Your Previous Recommendations </h3>
        {previousRecommendations.length > 0 ? (
          <table className="recommendations-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Crop</th>
                <th>Soil Type</th>
                <th>Nitrogen</th>
                <th>Phosphorus</th>
                <th>Potassium</th>
                <th>pH</th>
              </tr>
            </thead>
            <tbody>
              <style>
                {`
                  .recommendations-table, 
                  .recommendations-table th, 
                  .recommendations-table td {
                    border: 1px solid black;
                    border-collapse: collapse;
                  }
                `}
              </style>
              {previousRecommendations.map((rec, index) => (
                <tr key={rec.recommendation_id || index}>
                  <td>
                    {rec.recommended_on
                      ? formatDate(rec.recommended_on)
                      : "N/A"}
                  </td>
                  <td>{rec.recommended_crop}</td>
                  <td>{rec.soil_type}</td>
                  <td>{rec.nitrogen}</td>
                  <td>{rec.phosphorus}</td>
                  <td>{rec.potassium}</td>
                  <td>{rec.pH}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No previous recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
