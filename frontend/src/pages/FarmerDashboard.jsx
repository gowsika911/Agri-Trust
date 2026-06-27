import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createCrop, getMyCrops } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    pricePerUnit: '',
    harvestDate: '',
    location: '',
    description: '',
    isOrganic: false,
  });

  useEffect(() => {
    if (!user || user.role !== 'farmer') {
      navigate('/login');
      return;
    }
    fetchMyCrops();
  }, [user]);

  const fetchMyCrops = async () => {
    try {
      const response = await getMyCrops();
      setCrops(response.data.crops);
    } catch (error) {
      toast.error('Failed to fetch crops');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox'
      ? e.target.checked
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCrop(formData);
      toast.success('Crop uploaded successfully!');
      setShowForm(false);
      fetchMyCrops();
      setFormData({
        cropName: '',
        variety: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        harvestDate: '',
        location: '',
        description: '',
        isOrganic: false,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create crop');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🌾 Farmer Dashboard</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Upload Crop'}
        </button>
      </div>

      {/* Upload Crop Form */}
      {showForm && (
        <div className="card" style={{ marginTop: '20px' }}>
          <h3>Upload New Crop</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Crop Name *</label>
                <input
                  type="text"
                  name="cropName"
                  placeholder="e.g. Rice, Wheat"
                  value={formData.cropName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Variety</label>
                <input
                  type="text"
                  name="variety"
                  placeholder="e.g. Basmati"
                  value={formData.variety}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="e.g. 500"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="kg">kg</option>
                  <option value="quintal">quintal</option>
                  <option value="ton">ton</option>
                  <option value="litre">litre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price Per Unit (₹) *</label>
                <input
                  type="number"
                  name="pricePerUnit"
                  placeholder="e.g. 45"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Harvest Date *</label>
                <input
                  type="date"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Organic?</label>
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  style={{ width: 'auto', marginTop: '10px' }}
                />
                <span style={{ marginLeft: '10px' }}>Yes, this is organic</span>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe your crop..."
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Crop'}
            </button>
          </form>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQR && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ textAlign: 'center', maxWidth: '300px' }}>
            <h3>QR Code</h3>
            <img src={selectedQR.qrCode} alt="QR Code" style={{ width: '200px' }} />
            <p style={{ marginTop: '10px', color: '#666' }}>
              {selectedQR.cropName}
            </p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '15px' }}
              onClick={() => setSelectedQR(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* My Crops List */}
      <div style={{ marginTop: '30px' }}>
        <h3>My Crops ({crops.length})</h3>
        {crops.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p>No crops uploaded yet. Click "Upload Crop" to get started!</p>
          </div>
        ) : (
          <div className="crops-grid">
            {crops.map((crop) => (
              <div key={crop._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{crop.cropName}</h3>
                  {getStatusBadge(crop.status)}
                </div>
                <p><strong>Variety:</strong> {crop.variety || 'N/A'}</p>
                <p><strong>Quantity:</strong> {crop.quantity} {crop.unit}</p>
                <p><strong>Price:</strong> ₹{crop.pricePerUnit}/kg</p>
                <p><strong>Location:</strong> {crop.location}</p>
                <p><strong>Organic:</strong> {crop.isOrganic ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Supply Steps:</strong> {crop.supplyChain?.length || 0}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedQR(crop)}
                  >
                    View QR Code
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;