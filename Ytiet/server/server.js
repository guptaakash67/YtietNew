import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from Next.js frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Enable credentials for cookies/auth
}));

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/ytiet")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileURL: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: true, // All users created via this route are admins
  },
});

const User = mongoose.model('User', userSchema);

// Define the only allowed admin email
const ADMIN_EMAIL = "admin@ytiet.com"; // Replace with your desired admin email

// Routes
app.get("/", (req, res) => {
  res.send("Working");
});

app.post('/api/v1/admin/signup', async (req, res) => {
  try {
    const { name, username, email, contact, password, profileURL } = req.body;

    // Check if the email matches the admin email
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Only the admin email is allowed to sign up' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user with plain-text password
    const newUser = new User({
      name,
      username,
      email,
      contact,
      password,
      profileURL,
      isAdmin: true,
    });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Signup successful' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/v1/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email matches the admin email
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Invalid email. Only the admin email is allowed' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password (plain text comparison)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Successful login
    res.status(200).json({ success: true, message: 'Login successful', admin: { name: user.name, email: user.email, isAdmin: true } });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
});

// New route to update username and password
app.put('/api/v1/admin/update', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Verify the request comes from the admin email
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Unauthorized. Only the admin can update credentials' });
    }

    // Find and update the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username and password
    user.username = username || user.username; // Only update if provided
    if (password) user.password = password; // Only update password if provided
    await user.save();

    res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error updating credentials', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});