require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/deepfake_detector';
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer upload
const upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        // Log the incoming file details
        console.log('Incoming file:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            headers: file.headers
        });

        // Accept specific image mime types
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
            console.log('File rejected - not an allowed image type');
            return cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
        }
        console.log('File accepted');
        cb(null, true);
    }
}).single('image');

app.use(cors());
app.use(express.json());

// MongoDB connection with error handling
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});

// Use the upload middleware in a wrapper to handle errors
app.post('/upload', (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'File upload error', details: err.message });
        } else if (err) {
            return res.status(400).json({ error: 'Invalid file type', details: err.message });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image file provided' });
            }

            const formData = new FormData();
            formData.append('file', fs.createReadStream(req.file.path), {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });

            const response = await axios.post('http://127.0.0.1:5001/predict', formData, {
                headers: formData.getHeaders(),
            });

            fs.unlinkSync(req.file.path);
            res.json(response.data);
        } catch (error) {
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkError) {
                    console.error('Error deleting file:', unlinkError);
                }
            }
            res.status(500).json({ 
                error: 'Error processing image',
                details: error.message
            });
        }
    });
});

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, securityQuestions } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            securityQuestions
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/forgot-password/verify-email', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'User found',
            questions: user.securityQuestions 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error middleware:', err);
    
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ 
            error: 'File upload error',
            details: err.message 
        });
    } else if (err) {
        return res.status(400).json({ 
            error: 'Invalid file type',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`✅ Node.js backend running on http://localhost:${PORT}`);
});