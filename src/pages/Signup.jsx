import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("user"); // "user" or "farmer"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "", // for farmers
    address: "", // for users
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        userType === "farmer"
          ? "http://localhost:3000/farmer/register"
          : "http://localhost:3000/users/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Register as:</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {userType === "farmer" ? (
          <div className="form-group">
            <label>Farm Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Delivery Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
