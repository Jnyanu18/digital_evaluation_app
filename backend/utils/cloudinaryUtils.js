const cloudinary = require("cloudinary").v2; // Use `require` for Cloudinary
const fs = require("fs"); // Use `require` for fs
const path = require("path"); // Use `require` for path

// Cloudinary configuration (ensure you load environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload files to Cloudinary (with different handling for images and PDFs)
const uploadOnCloudinary = async (localFilePath, mimetype) => {
  const maxRetries = 3;
  let attempt = 0;
  let response;

  while (attempt < maxRetries) {
    try {
      console.log(localFilePath);
      console.log("MIME Type:", mimetype); // Log the MIME type for debugging
      if (!localFilePath) return null;

      const uploadOptions = {
        resource_type: mimetype.includes("image") ? "image" : "raw",
        timeout: 180000, // 180 seconds timeout
      };

      response = await cloudinary.uploader.upload(localFilePath, uploadOptions);

      // File uploaded successfully, delete the local file
      fs.unlinkSync(localFilePath);

      return response;
    } catch (error) {
      attempt++;
      console.error(`Error uploading to Cloudinary (attempt ${attempt}):`, error);
      if (attempt >= maxRetries) {
        // In case of error, remove the local file and log the entire error object
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }
        throw error;
      }
    }
  }
};

module.exports = { uploadOnCloudinary };
