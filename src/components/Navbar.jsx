import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 'farmer' or 'user'
  const isAuthenticated = !!token; // Simplified check

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("farmerId");
    localStorage.removeItem("userId");
    navigate("/"); // Use navigate instead of window.location.href
  };

  // console.log("Current role:", role);

  return (
    <nav
      style={{
        padding: "15px 30px",
        backgroundColor: "#f8f9fa",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <h2 style={{ margin: 0 }}>Portal for farmers</h2>
          {isAuthenticated && (
            <Link to="/dashboard" style={{ margin: "0 10px" }}>
              Dashboard
            </Link>
          )}
          <style>{`
            .navbar-button {
              border: 1px solid #213547;
              border-radius: 5px;
              padding: 5px 10px;
              text-decoration: none;
              color: #213547;
            }
          `}</style>
          <Link
            to="/crops"
            className="navbar-button"
            style={{ margin: "0 10px" }}
          >
            Crops
          </Link>
          <Link
            to="/farmers"
            className="navbar-button"
            style={{ margin: "0 10px" }}
          >
            Farmers
          </Link>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {isAuthenticated ? (
            <>
              {role === "farmer" && (
                <>
                  <Link
                    to="/add-crop"
                    className="navbar-button"
                    style={{ margin: "0 10px" }}
                  >
                    Add Crop
                  </Link>
                  <Link
                    to="/rental-form"
                    className="navbar-button"
                    style={{ margin: "0 10px" }}
                  >
                    Rent
                  </Link>
                  <Link
                    to="/rentals"
                    className="navbar-button"
                    style={{ margin: "0 10px" }}
                  >
                    View Properties for Rent
                  </Link>

                  <Link
                    to="/crop-recommendation"
                    className="navbar-button"
                    style={{ margin: "0 10px" }}
                  >
                    Crop Recommendation
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
