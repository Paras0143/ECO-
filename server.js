const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Users file path
const usersFile = path.join(__dirname, 'uploads', 'users.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'uploaded-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Authentication Routes

// Helper function to get users
function getUsers() {
    if (fs.existsSync(usersFile)) {
        return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
    return [];
}

// Helper function to save users
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Generate JWT token
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// Sign Up endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const users = getUsers();
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        saveUsers(users);

        // Generate token
        const token = generateToken(newUser);

        // Return user data (without password)
        const userData = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            name: `${newUser.firstName} ${newUser.lastName}`
        };

        res.json({
            success: true,
            message: 'Account created successfully',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Sign In endpoint
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Return user data (without password)
        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        };

        res.json({
            success: true,
            message: 'Signed in successfully',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ error: 'Failed to sign in' });
    }
});

// Google OAuth verification endpoint
app.post('/api/auth/google', (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: 'Google credential is required' });
        }

        // Decode the JWT token from Google
        const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64').toString());

        // Check if user exists
        const users = getUsers();
        let user = users.find(u => u.email === payload.email);

        if (!user) {
            // Create new user from Google data
            user = {
                id: Date.now().toString(),
                firstName: payload.given_name || 'Google',
                lastName: payload.family_name || 'User',
                email: payload.email,
                googleId: payload.sub,
                picture: payload.picture,
                createdAt: new Date().toISOString()
            };

            users.push(user);
            saveUsers(users);
        }

        // Generate token
        const token = generateToken(user);

        // Return user data
        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            picture: user.picture
        };

        res.json({
            success: true,
            message: 'Google authentication successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Failed to authenticate with Google' });
    }
});

// Verify token middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Protected route example
app.get('/api/auth/profile', verifyToken, (req, res) => {
    const users = getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        picture: user.picture
    };

    res.json({ user: userData });
});

// Routes

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        // Save image info to a JSON file for persistence
        const imageInfo = {
            id: Date.now(),
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: imageUrl,
            uploadedAt: new Date().toISOString(),
            size: req.file.size
        };

        // Read existing images or create new array
        let images = [];
        const imagesFile = path.join(__dirname, 'uploads', 'images.json');

        if (fs.existsSync(imagesFile)) {
            const data = fs.readFileSync(imagesFile, 'utf8');
            images = JSON.parse(data);
        }

        // Add new image
        images.push(imageInfo);

        // Save updated images list
        fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            image: imageInfo
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Get all uploaded images
app.get('/api/images', (req, res) => {
    try {
        const imagesFile = path.join(__dirname, 'uploads', 'images.json');

        if (fs.existsSync(imagesFile)) {
            const data = fs.readFileSync(imagesFile, 'utf8');
            const images = JSON.parse(data);
            res.json(images);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

// Delete an image
app.delete('/api/images/:id', (req, res) => {
    try {
        const imageId = parseInt(req.params.id);
        const imagesFile = path.join(__dirname, 'uploads', 'images.json');

        if (fs.existsSync(imagesFile)) {
            const data = fs.readFileSync(imagesFile, 'utf8');
            let images = JSON.parse(data);

            const imageIndex = images.findIndex(img => img.id === imageId);

            if (imageIndex !== -1) {
                const image = images[imageIndex];

                // Delete the actual file
                const filePath = path.join(__dirname, 'uploads', image.filename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }

                // Remove from images array
                images.splice(imageIndex, 1);

                // Save updated images list
                fs.writeFileSync(imagesFile, JSON.stringify(images, null, 2));

                res.json({ success: true, message: 'Image deleted successfully' });
            } else {
                res.status(404).json({ error: 'Image not found' });
            }
        } else {
            res.status(404).json({ error: 'No images found' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// --- Report Submission Endpoint ---
const reportsFile = path.join(__dirname, 'uploads', 'reports.json');

app.post('/api/report', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        // Parse other fields from the form
        const fields = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;
        // Priority logic
        const priorityMap = {
            'hazardous': 'Critical',
            'animal-death': 'High',
            'animal-care': 'High',
            'animal-adopt': 'High',
            'garbage': 'Medium',
            'cleaning': 'Medium',
            'recycling': 'Medium',
            'other': 'Medium'
        };
        const priority = priorityMap[fields['report-type']] || 'Medium';
        const report = {
            id: Date.now(),
            location: fields.location,
            latitude: fields.latitude || null,
            longitude: fields.longitude || null,
            type: fields['report-type'],
            description: fields.description,
            size: fields.size || 'Not specified',
            accessibility: fields.accessibility || 'Not specified',
            name: fields.name || 'Anonymous',
            phone: fields.phone || 'Not provided',
            image: imageUrl,
            status: 'Pending',
            priority: priority,
            timestamp: new Date().toISOString(),
            comments: []
        };

        // Read existing reports
        let reports = [];
        if (fs.existsSync(reportsFile)) {
            reports = JSON.parse(fs.readFileSync(reportsFile, 'utf8'));
        }
        reports.push(report);
        fs.writeFileSync(reportsFile, JSON.stringify(reports, null, 2));
        res.json({ success: true, message: 'Report submitted successfully', report });
    } catch (error) {
        console.error('Report upload error:', error);
        res.status(500).json({ error: 'Failed to submit report' });
    }
});

// --- Get All Reports Endpoint ---
app.get('/api/reports', (req, res) => {
    try {
        if (fs.existsSync(reportsFile)) {
            const reports = JSON.parse(fs.readFileSync(reportsFile, 'utf8'));
            res.json(reports);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// --- Clear All Reports Endpoint (with password) ---
app.post('/api/clear-reports', express.json(), (req, res) => {
    const { password } = req.body;
    // Set your admin password here (change as needed)
    const ADMIN_PASSWORD = '01430143';
    if (password !== ADMIN_PASSWORD) {
        return res.status(403).json({ success: false, error: 'Incorrect password' });
    }
    try {
        if (fs.existsSync(reportsFile)) {
            fs.writeFileSync(reportsFile, '[]');
        }
        res.json({ success: true, message: 'All reports cleared' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to clear reports' });
    }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
    }

    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Upload directory: ${uploadsDir}`);
}); 