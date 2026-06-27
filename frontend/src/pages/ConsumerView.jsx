import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConsumerView = () => {
  const [cropId, setCropId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (cropId.trim()) {
      navigate(`/track/${cropId.trim()}`);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card" style={{ marginTop: '50px', textAlign: 'center' }}>
        <h2>📱 Track Your Product</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Enter the Crop ID from the QR code to see the complete supply chain history
        </p>
        <form onSubmit={handleTrack}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Crop ID here..."
              value={cropId}
              onChange={(e) => setCropId(e.target.value)}
              style={{ textAlign: 'center', fontSize: '1.1rem' }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            🔍 Track Crop
          </button>
        </form>
        <p style={{ marginTop: '20px', color: '#999', fontSize: '0.9rem' }}>
          Or scan a QR code on the product packaging
        </p>
      </div>
    </div>
  );
};

export default ConsumerView;