import { useEffect, useState } from "react";
import SellerProducts from "./SellerProducts";

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetch("https://wishlink-backend.onrender.com/users/sellers", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setSellers(data))
      .catch(() => setSellers([]));
  }, []);

  return (
    <div className="sellers-container">
      <div className="sellers-list">
        <h2>All Sellers</h2>
        {sellers.length === 0 ? (
          <p>No sellers found</p>
        ) : (
          <div className="sellers-grid">
            {sellers.map((seller) => (
              <button
                key={seller.user_id}
                className={`seller-card ${
                  selectedSeller === seller.user_id ? "selected" : ""
                }`}
                onClick={() => setSelectedSeller(seller.user_id)}
              >
                {seller.username}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedSeller && (
        <div className="seller-products">
          <SellerProducts sellerId={selectedSeller} />
        </div>
      )}
    </div>
  );
};

export default SellersList;
