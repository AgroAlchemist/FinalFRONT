import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`https://wishlink-backend.onrender.com/products/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://wishlink-backend.onrender.com/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(product),
        }
      );

      if (response.ok) {
        setMessage("Product updated successfully!");
        setTimeout(() => navigate("/products"), 1500);
      } else {
        setMessage("Failed to update product");
      }
    } catch (error) {
      setMessage("Error updating product");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>
        <div>
          <label>Product URL:</label>
          <input
            type="url"
            value={product.product_url}
            onChange={(e) =>
              setProduct({ ...product, product_url: e.target.value })
            }
          />
        </div>
        <button type="submit">Update Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditProduct;
