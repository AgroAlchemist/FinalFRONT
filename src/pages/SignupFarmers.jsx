import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/authApi";

const Signup = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser(userData);
      navigate("/login");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <h2>Signup for farmers</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          value={userData.username}
          onChange={(e) =>
            setUserData({ ...userData, username: e.target.value })
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          required
        />
        <select
          value={userData.role}
          onChange={(e) => setUserData({ ...userData, role: e.target.value })}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit">Signup for farmers</button>
      </form>
    </div>
  );
};

export default Signup;
