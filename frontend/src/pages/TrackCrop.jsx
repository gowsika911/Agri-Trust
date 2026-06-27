import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSupplyChainSummary } from '../services/api';

const TrackCrop = () => {
  const { cropId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [cropId]);

  const fetchSummary = async () => {
    try {
      const response = await getSupplyChainSummary(cropId);
      setSummary(response.data.summary);
    } catch (error) {
      setError('Crop not found. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading supply chain data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="card" style={{ marginTop: '20px' }}>
        <h2>🌾 {summary.cropName} {summary.variety && `(${summary.variety})`}</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <span className={`badge badge-${summary.currentStatus}`}>
            {summary.currentStatus}
          </span>
          {summary.isOrganic && (
            <span className="badge" style={{ background: '#d8f3dc', color: '#2d6a4f' }}>
              ✅ Organic
            </span>
          )}
        </div>

        {/* Price Summary */}
        <div style={{
          background: '#f0f4f0',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3>💰 Price Journey</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666' }}>Farm Price</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d6a4f' }}>
                {summary.farmPrice}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666' }}>Current Price</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e63946' }}>
                {summary.currentPrice}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666' }}>Price Increase</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e76f51' }}>
                {summary.priceIncreasePercent}
              </p>
            </div>
          </div>
        </div>

        {/* Farmer Info */}
        <div className="card" style={{ background: '#f9f9f9' }}>
          <h3>👨‍🌾 Farmer Details</h3>
          <p><strong>Name:</strong> {summary.farmerName}</p>
          <p><strong>Location:</strong> {summary.farmerLocation}</p>
          <p><strong>Harvest Date:</strong> {new Date(summary.harvestDate).toLocaleDateString()}</p>
        </div>

        {/* Supply Chain Steps */}
        <h3 style={{ marginTop: '20px', marginBottom: '15px' }}>
          📦 Supply Chain Journey ({summary.totalSteps} steps)
        </h3>
        <div className="supply-chain">
          {summary.supplyChainSteps.map((step) => (
            <div key={step.step} className="supply-step">
              <div className="step-number">{step.step}</div>
              <div className="step-content">
                <h4>{step.stepName}</h4>
                <p><strong>Handled by:</strong> {step.handledBy}</p>
                <p><strong>Location:</strong> {step.location}</p>
                <p><strong>Price:</strong> {step.price}</p>
                {step.description && (
                  <p><strong>Note:</strong> {step.description}</p>
                )}
                <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '8px' }}>
                  {new Date(step.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackCrop;