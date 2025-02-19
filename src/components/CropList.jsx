import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/crops")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => {
        //console.log("Products from API:", data);
        const productsArray = Array.isArray(data) ? data : [];
        setProducts(productsArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError(error.message);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-grid">
      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        products.map((product, key) => (
          <ProductCard key={key} product={product} showSeller={true} />
        ))
      )}
    </div>
  );
};

export default ProductList;
