import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>🌾 Agri Trust</h1>
        <p>
          Blockchain-powered agricultural supply chain transparency.
          <br />
          Fair prices for farmers. Verified products for consumers.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-secondary">
            Join as Farmer
          </Link>
          <Link to="/consumer" className="btn btn-primary"
            style={{ background: 'white', color: '#2d6a4f' }}>
            Track a Product
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2>Why Agri Trust?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">🌱</div>
            <h3>Fair Prices</h3>
            <p>Farmers get fair prices with complete price transparency across the supply chain.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🔗</div>
            <h3>Blockchain Secured</h3>
            <p>Every step is recorded on blockchain. Tamper-proof and permanently verifiable.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📱</div>
            <h3>QR Code Tracking</h3>
            <p>Scan QR code to instantly see the complete journey of your food product.</p>
          </div>
          <div className="feature-card">
            <div className="icon">✅</div>
            <h3>Verified Authenticity</h3>
            <p>Know exactly where your food comes from and who handled it.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;