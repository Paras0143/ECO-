# Clean and Healthy Area - Image Upload System

A web application for community waste management and image sharing with Node.js backend.

## Features

- **Image Upload**: Users can upload images that are visible to all visitors
- **Real-time Display**: All uploaded images are displayed in a grid layout
- **Image Management**: Delete uploaded images with confirmation
- **Responsive Design**: Works on desktop and mobile devices
- **File Validation**: Only accepts image files (JPG, PNG, GIF, etc.)
- **File Size Limit**: 10MB maximum file size

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`
   - The application will be available at this URL

## Project Structure

```
11/
├── server.js              # Main Node.js server file
├── package.json           # Project dependencies and scripts
├── index.html            # Main HTML file
├── script.js             # Frontend JavaScript
├── uploads/              # Directory for uploaded images (created automatically)
│   └── images.json       # Database file for image metadata
├── images/               # Static images
├── img2/                 # Gallery images
├── imgd/                 # Animal gallery images
└── README.md             # This file
```

## API Endpoints

- `GET /` - Serve the main HTML page
- `POST /api/upload` - Upload an image file
- `GET /api/images` - Get all uploaded images
- `DELETE /api/images/:id` - Delete a specific image
- `GET /uploads/*` - Serve uploaded image files

## How It Works

1. **Image Upload**: Users select an image file and click "Upload Image"
2. **Server Processing**: The image is saved to the `uploads/` directory
3. **Metadata Storage**: Image information is stored in `uploads/images.json`
4. **Display**: All visitors see the same uploaded images in the "Community Uploaded Images" section
5. **Management**: Users can delete images with a confirmation dialog

## File Storage

- **Location**: `uploads/` directory (created automatically)
- **Naming**: Files are renamed with timestamps to avoid conflicts
- **Database**: `uploads/images.json` stores metadata for all images
- **Access**: Images are served via `/uploads/filename` URLs

## Security Features

- File type validation (images only)
- File size limits (10MB)
- Unique filename generation
- CORS enabled for cross-origin requests

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change the port in `server.js`: `const PORT = process.env.PORT || 3001;`

2. **Upload Directory Not Created**
   - The server creates the `uploads/` directory automatically
   - Ensure the application has write permissions

3. **Images Not Loading**
   - Check that the server is running on `http://localhost:3000`
   - Verify the API_BASE_URL in `script.js` matches your server URL

4. **CORS Errors**
   - The server includes CORS middleware
   - If issues persist, check browser console for specific errors

### Development Tips

- Use `npm run dev` for development with auto-restart
- Check browser console for JavaScript errors
- Monitor server console for backend errors
- Images are stored locally - consider cloud storage for production

## Production Deployment

For production deployment:

1. **Environment Variables**: Set `PORT` environment variable
2. **File Storage**: Consider using cloud storage (AWS S3, Google Cloud Storage)
3. **Database**: Use a proper database instead of JSON file
4. **Security**: Add authentication and authorization
5. **HTTPS**: Enable HTTPS for secure file uploads

## License

MIT License - feel free to use and modify as needed.
