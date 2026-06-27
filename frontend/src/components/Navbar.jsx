import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🌾 Agri Trust
      </Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            {user.role === 'farmer' && (
              <li><Link to="/farmer/dashboard">Dashboard</Link></li>
            )}
            {user.role === 'consumer' && (
              <li><Link to="/consumer">Track Crops</Link></li>
            )}
            <li>
              <span style={{ color: '#95d5b2' }}>
                Hi, {user.name}!
              </span>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '5px 15px' }}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;