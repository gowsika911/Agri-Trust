const QRCode = require('qrcode');

const generateQRCode = async (cropId) => {
  try {
    // This URL will show crop details when scanned
    const cropUrl = `http://localhost:5173/track/${cropId}`;

    // Generate QR code as base64 image string
    const qrCodeBase64 = await QRCode.toDataURL(cropUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return qrCodeBase64;
  } catch (error) {
    throw new Error(`QR Code generation failed: ${error.message}`);
  }
};

module.exports = { generateQRCode };