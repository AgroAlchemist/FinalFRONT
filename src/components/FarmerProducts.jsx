import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";

const FarmerProducts = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        // First fetch farmer details
        const farmerResponse = await fetch(
          `http://localhost:3000/farmer/profile/${id}`
        );
        const farmerData = await farmerResponse.json();

        if (farmerResponse.ok) {
          setFarmer(farmerData);
        } else {
          setError(farmerData.error || "Failed to fetch farmer details");
          return;
        }

        // Then fetch farmer's crops
        const cropsResponse = await fetch(
          `http://localhost:3000/crops/farmer/${id}`
        );
        const cropsData = await cropsResponse.json();

        if (cropsResponse.ok) {
          setCrops(cropsData);
        } else {
          setError(cropsData.error || "Failed to fetch crops");
        }
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!farmer) return <div>Farmer not found</div>;

  return (
    <div>
      <h2>{farmer.name}'s Crops</h2>
      {crops.length === 0 ? (
        <p>No crops listed by this farmer</p>
      ) : (
        <div className="product-grid">
          {crops.map((crop) => (
            <ProductCard key={crop.crop_id} product={crop} showSeller={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmerProducts;
