const express = require('express');
const router = express.Router();
const {
  getChain,
  validateChain,
} = require('../blockchain/fabricClient');
const Block = require('../models/Block');

// GET FULL BLOCKCHAIN FOR A CROP
router.get('/:cropId/chain', async (req, res) => {
  try {
    const chain = await getChain(req.params.cropId);

    if (chain.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No blockchain found for this crop',
      });
    }

    return res.status(200).json({
      success: true,
      cropId: req.params.cropId,
      totalBlocks: chain.length,
      chain,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

// VALIDATE BLOCKCHAIN INTEGRITY
router.get('/:cropId/validate', async (req, res) => {
  try {
    const result = await validateChain(req.params.cropId);

    return res.status(200).json({
      success: true,
      cropId: req.params.cropId,
      validation: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;