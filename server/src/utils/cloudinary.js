import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadMediaToCloudinary = async (filePath, options = {}) => {
  if (typeof filePath !== 'string') {
    throw new Error('Invalid file path');
  }

  // Check if file exists before attempting upload
  if (!fs.existsSync(filePath)) {
    throw new Error('File path is invalid or file does not exist');
  }

  try {
    // 1. Attempt Upload
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
      ...options,
    });

    // Successful Upload? Great! Now try to delete local file safely.
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupError) {
      console.warn(
        'Warning: Failed to delete temp file after upload:',
        filePath
      );
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    // Upload Failed? Try to delete local file and throw error.
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupError) {
    }

    console.error('Error inside uploadMediaToCloudinary:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const deleteMediaFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error inside deleteMediaFromCloudinary:', error);
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

export { cloudinary, uploadMediaToCloudinary, deleteMediaFromCloudinary };
