import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginFarmer } from "../api/authApi";
import Dashboard from "./Dashboard";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userType, setUserType] = useState("user"); // 'user' or 'farmer'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;
      if (userType === "farmer") {
        data = await loginFarmer(email, password);
        localStorage.setItem("farmerId", data.farmerId.toString());
      } else {
        data = await loginUser(email, password);
        localStorage.setItem("userId", data.userId.toString());
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", userType);

      // Wait a bit to ensure localStorage is updated
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard", { replace: true });
        // Force a page reload to update the app state
        window.location.reload();
      }, 100);
    } catch (err) {
      setLoading(false);
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            disabled={loading}
          >
            <option value="user">User</option>
            <option value="farmer">Farmer</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
