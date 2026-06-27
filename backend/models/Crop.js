const mongoose = require('mongoose');

const supplyChainStepSchema = new mongoose.Schema({
  stepName: {
    type: String,
    required: true,
  },
  handledBy: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const cropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'litre'],
      default: 'kg',
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
    },
    harvestDate: {
      type: Date,
      required: [true, 'Harvest date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    supplyChain: [supplyChainStepSchema],
    qrCode: {
      type: String,
    },
    cropId: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['harvested', 'processing', 'transit', 'delivered'],
      default: 'harvested',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);