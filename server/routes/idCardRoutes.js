

const QRCode = require('qrcode');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Process only POST requests
  if (req.method === 'POST') {
    try {
      const { name, email, phno, imageData } = req.body;

      // Create ID card data
      const idCardData = {
        name,
        email,
        phno,
        imageData,
      };

      // Generate QR code from ID card data
      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({
        name,
        email,
        phno
      }));
      
      // Add QR code to the ID card data
      idCardData.qrCode = qrCodeDataUrl;
      
      // Send response
      res.status(200).json(idCardData);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  } else {
    // Handle invalid method
    res.status(405).json({ error: 'Method not allowed' });
  }
};

