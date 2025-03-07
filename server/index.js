
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();

// Increase payload size limit
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors(
  {
    origin: [""],
    methods: ["POST", "GET"],
    credentials: true
  }
));

app.get("/", (req, res) => {
  res.json("Hi");
});

// Route to handle ID card generation
app.post("/generate-id-card", async (req, res) => {
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
    res.json(idCardData);
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
