import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CropList from "./components/CropList";
import AddCrop from "./components/AddCrop";
import FarmerList from "./components/FarmerList";
import FarmerProducts from "./components/FarmerProducts";
import EditCrop from "./components/EditCrop";
import CropRecommendation from "./components/CropRecommendation";
import RentalForm from "./components/RentalForm";
import RentalList from "./components/RentalsList";
import RentalsList from "./components/RentalsList";
import Landing from './pages/Landing';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  // Don't show Navbar on landing page
  const showNavbar = location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/crops" element={<CropList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/farmers" element={<FarmerList />} />
          <Route path="/rental-form" element={<RentalForm />} />
          <Route path="/rentals" element={<RentalsList />} />
          <Route path="/farmer/profile/:id" element={<FarmerProducts />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Login />}
          />

          <Route
            path="/add-crop"
            element={
              isAuthenticated && userRole === "farmer" ? <AddCrop /> : <Login />
            }
          />

          <Route
            path="/crop-recommendation"
            element={
              isAuthenticated && userRole === "farmer" ? (
                <CropRecommendation />
              ) : (
                <Login />
              )
            }
          />

          <Route
            path="/edit-crop/:id"
            element={
              isAuthenticated && userRole === "farmer" ? (
                <EditCrop />
              ) : (
                <Login />
              )
            }
          />

          {/* Catch all route for 404 */}
          <Route
            path="*"
            element={
              <div>
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </>
  );
};

export default App;
