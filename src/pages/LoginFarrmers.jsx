import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      // console.log("Login response data:", data); // Debug log

      // Updated to use userId instead of user_id
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId.toString()); // Changed from user_id to userId

      // console.log("Stored values:", {
      //   token: localStorage.getItem("token"),
      //   role: localStorage.getItem("role"),
      //   userId: localStorage.getItem("userId"),
      // }); // Debug log

      navigate("/dashboard");
    } catch (err) {
      // Fix error handling
      setError(err.message || "An error occurred during login");
    }
  };

  return (
    <div className="login-form">
      <h2>Login for farmers</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login for farmers</button>
      </form>
    </div>
  );
};

export default Login;
