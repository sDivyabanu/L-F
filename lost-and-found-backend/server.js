const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // I
const authRoutes = require('./routes/auth'); // Import auth routes
const itemRoutes = require('./routes/items');
const Item = require('./models/Item'); // Import the model

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up storage for uploaded images using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // Specify upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append date to filename
    },
});

const uploads = multer({ storage });

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request to ${req.method} ${req.url} with body:`, req.body);
    next();
});

// Routes for lost items
app.post('/api/lost', uploads.single('image'), async (req, res) => {
    console.log('Request body:', req.body); // Log the body
    console.log('Uploaded file:', req.file); // Log the file

    try {
        if (!req.file) {
            return res.status(400).send({ message: 'Image is required' });
        }

        const newItem = new Item({
            title: req.body.title, // Ensure this matches the field name in your frontend
            description: req.body.description,
            contact: req.body.contact,
            image: req.file.path, // Store image path
            isFound: false, // Default state
            status: req.body.status // Ensure this is included
        });

        await newItem.save();
        res.status(201).send({ message: 'Lost item added', item: newItem });
    } catch (error) {
        console.error('Error adding lost item:', error); // Log the error
        res.status(500).send({ message: 'Error adding lost item', error });
    }
});


app.get('/api/lost', async (req, res) => {
    try {
        const lostItems = await Item.find({ isFound: false }); // Fetch only lost items
        res.status(200).send(lostItems);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching lost items', error });
    }
});

// Routes for found items
// Routes for found items
app.post('/api/found', uploads.single('image'), async (req, res) => {
    console.log('Request body:', req.body); // Log the body
    console.log('Uploaded file:', req.file); // Log the file

    try {
        // Check if the image file is provided
        if (!req.file) {
            return res.status(400).send({ message: 'Image is required' });
        }

        // Create a new found item
        const newItem = new Item({
            title: req.body.title, // Ensure this matches the field name in your frontend
            description: req.body.description,
            contact: req.body.contact,
            image: req.file.path, // Store image path
            isFound: true, // Mark this item as found
            status: req.body.status // Ensure this is included
        });

        // Save the new item to the database
        await newItem.save();
        res.status(201).send({ message: 'Found item added', item: newItem });
    } catch (error) {
        console.error('Error adding found item:', error); // Log the error
        res.status(500).send({ message: 'Error adding found item', error });
    }
});


app.get('/api/found', async (req, res) => {
    try {
        const foundItems = await Item.find({ isFound: true }); // Fetch only found items
        res.status(200).send(foundItems);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching found items', error });
    }
});

// Use auth routes
app.use('/api/auth', authRoutes); // Mount auth routes at /api/auth
app.use('/api/items', itemRoutes); // Ensure itemRoutes are set up correctly

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
