import express from "express";
const app = express(); // Declare `app` only once
import mongoose from "mongoose";

//database connection
mongoose.connect("mongodb://127.0.0.1:27017/ytiet")
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

//schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        },   
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unquiue: true,

    }
})

const User = mongoose.model('User',userSchema)

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Working");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});