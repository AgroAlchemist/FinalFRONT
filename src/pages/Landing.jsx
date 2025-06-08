import { useState, useEffect } from 'react';
import { FaSeedling, FaCloudSunRain, FaUsers, FaChartLine, FaAngleDown } from 'react-icons/fa';
import { loginFarmer, loginUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Add scroll effect for header
    const handleScroll = () => {
      const header = document.querySelector('header');
      header.classList.toggle('scrolled', window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    console.log("login alay");
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let data;
      if (userType === 'farmer') {
        data = await loginFarmer(formData.email, formData.password);
        localStorage.setItem('farmerId', data.farmerId.toString());
      } else {
        data = await loginUser(formData.email, formData.password);
        localStorage.setItem('userId', data.userId.toString());
      }

      // Store auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', userType);

      // Wait a bit to ensure localStorage is updated
      setTimeout(() => {
        setLoading(false);
        setShowLoginModal(false);
        navigate('/dashboard', { replace: true });
        // Force a page reload to update the app state
        window.location.reload();
      }, 100);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'An error occurred during login');
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    console.log('Password reset requested for:', email);
    alert(`If an account exists for ${email}, you will receive password reset instructions.`);
    setShowForgotPasswordModal(false);
  };

  return (
    <div className="landing-page">
      <div className="scroll-indicator">
        <FaAngleDown />
      </div>

      <header>
        <nav>
          <div className="logo">
            <h1>🌾 Farmers Portal</h1>
          </div>
          <div className="nav-links">
            <a href="#hero">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <button className="auth-btn" onClick={() => setShowLoginModal(true)}>Login</button>
            <button className="auth-btn signup-btn" onClick={() => setShowSignupModal(true)}>Sign Up</button>
          </div>
        </nav>
      </header>

      <main>
        <section id="hero">
          <div className="hero-content">
            <h1>Welcome to the Future of Farming</h1>
            <p>Connect, Grow, and Prosper with our Advanced Agricultural Platform</p>
          </div>
        </section>

        <section id="features">
          <h2>Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaSeedling />
              <h3>Crop Management</h3>
              <p>Track and manage your crops efficiently</p>
            </div>
            <div className="feature-card">
              <FaCloudSunRain />
              <h3>Weather Updates</h3>
              <p>Real-time weather forecasts for better planning</p>
            </div>
            <div className="feature-card">
              <FaUsers />
              <h3>Community</h3>
              <p>Connect with fellow farmers</p>
            </div>
            <div className="feature-card">
              <FaChartLine />
              <h3>Market Insights</h3>
              <p>Stay updated with market trends</p>
            </div>
          </div>
        </section>

        <section id="about">
          <div className="about-container">
            <div className="about-content">
              <h2>About Us</h2>
              <p>Welcome to Farmers Portal, your trusted partner in agricultural innovation. We're dedicated to empowering farmers with cutting-edge technology and market connections to enhance their farming operations.</p>
              <p>Our platform brings together farmers, buyers, and agricultural experts to create a sustainable and profitable farming ecosystem. We believe in combining traditional farming wisdom with modern technology to achieve the best results.</p>
              
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">5000+</div>
                  <div className="stat-label">Active Farmers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Market Connections</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Farming landscape" />
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal" onClick={() => setShowLoginModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setShowLoginModal(false)}>&times;</span>
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="userType">I am a:</label>
                <select 
                  id="userType" 
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  disabled={loading}
                  required
                >
                  <option value="user">Buyer/User</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required 
                  disabled={loading}
                />
              </div>
              <div className="form-extras">
                <a href="#" className="forgot-password" onClick={() => {
                  setShowLoginModal(false);
                  setShowForgotPasswordModal(true);
                }}>Forgot Password?</a>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="modal" onClick={() => setShowForgotPasswordModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setShowForgotPasswordModal(false)}>&times;</span>
            <h2>Reset Password</h2>
            <p className="reset-instructions">Enter your email address and we'll send you instructions to reset your password.</p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="form-group">
                <label htmlFor="resetEmail">Email Address</label>
                <input type="email" id="resetEmail" required />
              </div>
              <button type="submit" className="submit-btn">Send Reset Link</button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="modal" onClick={() => setShowSignupModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close" onClick={() => setShowSignupModal(false)}>&times;</span>
            <h2>Sign Up</h2>
            <form>
              <div className="form-group">
                <label htmlFor="signupName">Full Name</label>
                <input type="text" id="signupName" required />
              </div>
              <div className="form-group">
                <label htmlFor="signupEmail">Email</label>
                <input type="email" id="signupEmail" required />
              </div>
              <div className="form-group">
                <label htmlFor="signupPassword">Password</label>
                <input type="password" id="signupPassword" required />
              </div>
              <div className="form-group">
                <label htmlFor="userType">I am a:</label>
                <select id="userType" required>
                  <option value="user">Buyer/User</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">Sign Up</button>
            </form>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2024 Farmers Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing; 