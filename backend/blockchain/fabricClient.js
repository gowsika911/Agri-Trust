const crypto = require('crypto');
const Block = require('../models/Block');

// ── Create SHA256 Hash ─────────────────────────────────────
const calculateHash = (index, timestamp, data, previousHash, nonce) => {
  return crypto
    .createHash('sha256')
    .update(index + timestamp + JSON.stringify(data) + previousHash + nonce)
    .digest('hex');
};

// ── Create Genesis Block (First Block) ────────────────────
const createGenesisBlock = async (cropId, cropData) => {
  const timestamp = new Date().toISOString();
  const data = {
    type: 'CROP_REGISTERED',
    cropId,
    ...cropData,
  };

  const hash = calculateHash(0, timestamp, data, '0000000000000000', 0);

  const genesisBlock = new Block({
    index: 0,
    timestamp,
    data,
    previousHash: '0000000000000000',
    hash,
    nonce: 0,
    cropId,
  });

  await genesisBlock.save();
  return genesisBlock;
};

// ── Add New Block to Chain ─────────────────────────────────
const addBlock = async (cropId, newData) => {
  // Get the last block for this crop
  const lastBlock = await Block.findOne({ cropId })
    .sort({ index: -1 });

  if (!lastBlock) {
    throw new Error('No genesis block found for this crop');
  }

  const newIndex = lastBlock.index + 1;
  const timestamp = new Date().toISOString();
  let nonce = 0;
  let hash = '';

  // Simple Proof of Work (hash must start with "00")
  do {
    nonce++;
    hash = calculateHash(
      newIndex,
      timestamp,
      newData,
      lastBlock.hash,
      nonce
    );
  } while (!hash.startsWith('00'));

  const newBlock = new Block({
    index: newIndex,
    timestamp,
    data: newData,
    previousHash: lastBlock.hash,
    hash,
    nonce,
    cropId,
  });

  await newBlock.save();
  return newBlock;
};

// ── Get Full Chain for a Crop ──────────────────────────────
const getChain = async (cropId) => {
  const chain = await Block.find({ cropId }).sort({ index: 1 });
  return chain;
};

// ── Validate Chain Integrity ───────────────────────────────
const validateChain = async (cropId) => {
  const chain = await Block.find({ cropId }).sort({ index: 1 });

  if (chain.length === 0) {
    return { valid: false, message: 'No blocks found' };
  }

  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    // Recalculate hash
    const recalculatedHash = calculateHash(
      currentBlock.index,
      currentBlock.timestamp,
      currentBlock.data,
      currentBlock.previousHash,
      currentBlock.nonce
    );

    // Check if hash is valid
    if (currentBlock.hash !== recalculatedHash) {
      return {
        valid: false,
        message: `Block ${currentBlock.index} has been tampered!`,
        tamperedBlock: currentBlock.index,
      };
    }

    // Check if previous hash matches
    if (currentBlock.previousHash !== previousBlock.hash) {
      return {
        valid: false,
        message: `Block ${currentBlock.index} is broken from chain!`,
        brokenAt: currentBlock.index,
      };
    }
  }

  return {
    valid: true,
    message: 'Blockchain is valid and untampered',
    totalBlocks: chain.length,
  };
};

module.exports = {
  createGenesisBlock,
  addBlock,
  getChain,
  validateChain,
};