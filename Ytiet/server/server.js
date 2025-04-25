import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/ytiet")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  profileURL: { type: String },
  isAdmin: { type: Boolean, default: true },
});
const User = mongoose.model('User', userSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  details: { type: String, required: true },
  posterURL: { type: String },
});
const Event = mongoose.model('Event', eventSchema);

// Define the only allowed admin email
const ADMIN_EMAIL = "admin@ytiet.com";

// Routes
app.get("/", (req, res) => res.send("Working"));

app.post('/api/v1/admin/signup', async (req, res) => {
  try {
    const { name, username, email, contact, password, profileURL } = req.body;
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Only the admin email is allowed to sign up' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const newUser = new User({ name, username, email, contact, password, profileURL, isAdmin: true });
    await newUser.save();
    res.status(201).json({ success: true, message: 'Signup successful' });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

app.post('/api/v1/admin/login', async (req, res) => {
  console.log('Login request received:', req.body);
  try {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Invalid email. Only the admin email is allowed' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.status(200).json({ success: true, message: 'Login successful', admin: { name: user.name, email: user.email, isAdmin: true } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(400).json({ message: 'Error logging in', error: error.message });
  }
});

app.put('/api/v1/admin/update', async (req, res) => {
  console.log('Update request received:', req.body);
  try {
    const { email, username, password } = req.body;
    if (email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: 'Unauthorized. Only the admin can update credentials' });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (username) user.username = username;
    if (password) user.password = password;
    await user.save();
    console.log('User updated:', user);
    res.status(200).json({ success: true, message: 'Credentials updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: 'Error updating credentials', error: error.message });
  }
});

app.post('/api/v1/event/edit/:id', async (req, res) => {
  console.log('Edit request received for event ID:', req.params.id, 'with data:', req.body);
  try {
    const { id } = req.params;
    const { title, details } = req.body;
    if (!id || !title || !details) {
      return res.status(400).json({ message: 'Title, details, and event ID are required' });
    }
    const event = await Event.findByIdAndUpdate(id, { title, details }, { new: true, runValidators: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ success: true, message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: 'Error updating event', error: error.message });
  }
});

app.get('/api/v1/event/:id', async (req, res) => {
  console.log('Fetch request received for event ID:', req.params.id);
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Event ID is required', success: false });
    }
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found', success: false });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(400).json({ message: 'Error fetching event', error: error.message, success: false });
  }
});

app.get('/api/v1/event', async (req, res) => {
  console.log('Fetch all events request received');
  try {
    const events = await Event.find();
    console.log('Fetched events from DB:', events);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(400).json({ message: 'Error fetching events', error: error.message, success: false });
  }
});

// New endpoint to create an event
app.post('/api/v1/event', async (req, res) => {
  console.log('Create event request received:', req.body);
  try {
    const { title, details, posterURL } = req.body;
    if (!title || !details) {
      return res.status(400).json({ message: 'Title and details are required', success: false });
    }
    const newEvent = new Event({ title, details, posterURL });
    await newEvent.save();
    console.log('Event created:', newEvent);
    res.status(201).json({ success: true, message: 'Event created successfully', data: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Error creating event', error: error.message, success: false });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));