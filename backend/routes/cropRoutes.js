const express = require('express');
const router = express.Router();
const {
  createCrop,
  getAllCrops,
  getCropById,
  getCropByCropId,
  getMyCrops,
} = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCrops);
router.get('/track/:cropId', getCropByCropId);

// Protected routes (login required)
router.post('/', protect, createCrop);
router.get('/my-crops', protect, getMyCrops);
router.get('/:id', getCropById);

module.exports = router;