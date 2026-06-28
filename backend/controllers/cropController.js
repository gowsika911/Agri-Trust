const Crop = require('../models/Crop');
const { generateQRCode } = require('../utils/qrGenerator');
const { v4: uuidv4 } = require('uuid');
const { createGenesisBlock } = require('../blockchain/fabricClient');

// CREATE CROP → POST /api/crops
const createCrop = async (req, res) => {
  try {
    const {
      cropName,
      variety,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      location,
      description,
      isOrganic,
    } = req.body;

    // Validate required fields
    if (!cropName || !quantity || !pricePerUnit || !harvestDate || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cropName, quantity, pricePerUnit, harvestDate and location',
      });
    }

    // Generate unique crop ID
    const cropId = uuidv4();

    // Generate QR Code
    const qrCode = await generateQRCode(cropId);

    // Create initial supply chain step
    const initialStep = {
      stepName: 'Harvested',
      handledBy: req.user.name,
      location: location,
      price: pricePerUnit,
      description: `Crop harvested by farmer ${req.user.name}`,
      timestamp: new Date(),
    };

    // Create crop in database
    const crop = await Crop.create({
      cropName,
      variety,
      quantity,
      unit: unit || 'kg',
      pricePerUnit,
      harvestDate,
      location,
      description,
      isOrganic: isOrganic || false,
      farmer: req.user.id,
      farmerName: req.user.name,
      supplyChain: [initialStep],
      qrCode,
      cropId,
      status: 'harvested',
    });

    // Create genesis block on blockchain
    await createGenesisBlock(cropId, {
      cropName,
      variety,
      quantity,
      unit: unit || 'kg',
      pricePerUnit,
      harvestDate,
      location,
      farmerName: req.user.name,
      isOrganic: isOrganic || false,
    });

    return res.status(201).json({
      success: true,
      message: 'Crop created successfully',
      crop: {
        id: crop._id,
        cropId: crop.cropId,
        cropName: crop.cropName,
        quantity: crop.quantity,
        unit: crop.unit,
        pricePerUnit: crop.pricePerUnit,
        location: crop.location,
        farmerName: crop.farmerName,
        status: crop.status,
        qrCode: crop.qrCode,
        supplyChain: crop.supplyChain,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// GET ALL CROPS → GET /api/crops
const getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find()
      .populate('farmer', 'name email location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// GET SINGLE CROP → GET /api/crops/:id
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id)
      .populate('farmer', 'name email phone location');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    return res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// GET CROP BY CROP ID (for QR scan) → GET /api/crops/track/:cropId
const getCropByCropId = async (req, res) => {
  try {
    const crop = await Crop.findOne({ cropId: req.params.cropId })
      .populate('farmer', 'name email phone location');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    return res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// GET MY CROPS (farmer only) → GET /api/crops/my-crops
const getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  createCrop,
  getAllCrops,
  getCropById,
  getCropByCropId,
  getMyCrops,
};