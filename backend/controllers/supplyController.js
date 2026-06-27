const Crop = require('../models/Crop');

// ADD SUPPLY CHAIN STEP → PUT /api/supply/:cropId/add-step
const addSupplyChainStep = async (req, res) => {
  try {
    const { stepName, handledBy, location, price, description } = req.body;

    if (!stepName || !handledBy || !location || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide stepName, handledBy, location and price',
      });
    }

    const crop = await Crop.findOne({ cropId: req.params.cropId });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    const newStep = {
      stepName,
      handledBy,
      location,
      price,
      description,
      timestamp: new Date(),
    };

    crop.supplyChain.push(newStep);

    if (stepName.toLowerCase() === 'processing') {
      crop.status = 'processing';
    } else if (stepName.toLowerCase() === 'transit') {
      crop.status = 'transit';
    } else if (stepName.toLowerCase() === 'delivered') {
      crop.status = 'delivered';
    }

    await crop.save();

    return res.status(200).json({
      success: true,
      message: 'Supply chain step added successfully',
      crop: {
        cropId: crop.cropId,
        cropName: crop.cropName,
        status: crop.status,
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

// GET FULL SUPPLY CHAIN → GET /api/supply/:cropId
const getSupplyChain = async (req, res) => {
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
      crop: {
        cropId: crop.cropId,
        cropName: crop.cropName,
        variety: crop.variety,
        quantity: crop.quantity,
        unit: crop.unit,
        isOrganic: crop.isOrganic,
        status: crop.status,
        farmer: crop.farmer,
        farmerName: crop.farmerName,
        harvestDate: crop.harvestDate,
        location: crop.location,
        supplyChain: crop.supplyChain,
        qrCode: crop.qrCode,
        createdAt: crop.createdAt,
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

// UPDATE CROP STATUS → PUT /api/supply/:cropId/status
const updateCropStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['harvested', 'processing', 'transit', 'delivered'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid status: harvested, processing, transit or delivered',
      });
    }

    const crop = await Crop.findOne({ cropId: req.params.cropId });

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    crop.status = status;
    await crop.save();

    return res.status(200).json({
      success: true,
      message: `Crop status updated to ${status}`,
      cropId: crop.cropId,
      cropName: crop.cropName,
      status: crop.status,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// GET SUPPLY CHAIN SUMMARY → GET /api/supply/:cropId/summary
const getSupplyChainSummary = async (req, res) => {
  try {
    const crop = await Crop.findOne({ cropId: req.params.cropId })
      .populate('farmer', 'name email phone location');

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    const firstPrice = crop.supplyChain[0]?.price || 0;
    const lastPrice = crop.supplyChain[crop.supplyChain.length - 1]?.price || 0;
    const priceIncrease = lastPrice - firstPrice;
    const priceIncreasePercent = ((priceIncrease / firstPrice) * 100).toFixed(2);

    return res.status(200).json({
      success: true,
      summary: {
        cropId: crop.cropId,
        cropName: crop.cropName,
        variety: crop.variety,
        isOrganic: crop.isOrganic,
        currentStatus: crop.status,
        farmerName: crop.farmerName,
        farmerLocation: crop.location,
        harvestDate: crop.harvestDate,
        totalSteps: crop.supplyChain.length,
        farmPrice: `₹${firstPrice}/kg`,
        currentPrice: `₹${lastPrice}/kg`,
        priceIncrease: `₹${priceIncrease}/kg`,
        priceIncreasePercent: `${priceIncreasePercent}%`,
        supplyChainSteps: crop.supplyChain.map((step, index) => ({
          step: index + 1,
          stepName: step.stepName,
          handledBy: step.handledBy,
          location: step.location,
          price: `₹${step.price}/kg`,
          description: step.description,
          timestamp: step.timestamp,
        })),
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

module.exports = {
  addSupplyChainStep,
  getSupplyChain,
  updateCropStatus,
  getSupplyChainSummary,
};