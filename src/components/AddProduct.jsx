import { useState } from "react";

const AddProduct = () => {
  const [productUrl, setProductUrl] = useState("");
  const [source, setSource] = useState("flipkart");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://wishlink-backend.onrender.com/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ product_url: productUrl, source }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Product added successfully!");
      } else {
        setMessage(
          `❌ YOU ARE NOT A SELLER, PLEASE REGISTER AS A SELLER FIRST`
        );
      }
    } catch (error) {
      setMessage("❌ Failed to add product.");
    } finally {
      setLoading(false);
      setProductUrl("");
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Product URL:
          <input
            type="url"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            required
          />
        </label>
        <label>
          Source:
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="flipkart">Flipkart</option>
            <option value="amazon">Amazon</option>
            <option value="myntra">Myntra</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
