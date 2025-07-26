const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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