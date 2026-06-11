require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

const app = express();

// Enable CORS so your frontend port can securely talk to this backend port
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://127.0.0.1:5500", "http://localhost:5500" ],
  methods: ["POST", "GET", "OPTIONS"], // <-- Added OPTIONS here
  credentials: true
}));
app.use(express.json());

// Initialize Google's official OAuth verification tool
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// === PUT THE DEBUG LINE RIGHT HERE ===
console.log("Loaded Google Client ID:", process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token missing from request body." });
  }

  try {
    // Verify that the token payload matches your official Google client registration
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract the secure profile information from the token payload
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // 'sub' is the unique, permanent numeric ID assigned to this Google account
    console.log(`Backend securely verified user: ${name} (${email}) with ID: ${sub}`);

    // APPLICATION LOGIC PLACEHOLDER:
    // This is where you lookup the user ID 'sub' in your SQL or MongoDB database.
    // If they do not exist yet, you create a new account profile for them.

    // Respond back to your HTML client with the verified user's information
    res.status(200).json({
      message: "Login verified",
      user: { id: sub, email, name, picture }
    });

  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired authorization token." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend auth service listening on port ${PORT}`));