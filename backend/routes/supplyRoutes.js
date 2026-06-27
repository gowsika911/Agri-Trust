const express = require('express');
const router = express.Router();
const {
  addSupplyChainStep,
  getSupplyChain,
  updateCropStatus,
  getSupplyChainSummary,
} = require('../controllers/supplyController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/:cropId', getSupplyChain);
router.get('/:cropId/summary', getSupplyChainSummary);

// Protected routes
router.put('/:cropId/add-step', protect, addSupplyChainStep);
router.put('/:cropId/status', protect, updateCropStatus);

module.exports = router;