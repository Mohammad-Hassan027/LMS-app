import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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

  const safePath = path.resolve(filePath); //absolute

  if (!safePath || !fs.existsSync(safePath)) {
    throw new Error('File path is invalid or file does not exist');
  }

  try {
    const result = await cloudinary.uploader.upload(safePath, {
      resource_type: 'auto',
      ...options,
    });
    fs.unlinkSync(safePath);
    const data = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    return data;
  } catch (error) {
    if (fs.existsSync(safePath)) {
      fs.unlinkSync(safePath);
    }
    console.log('Error inside uploadMediaToCloudinary:', error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const deleteMediaFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    const data = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    return data;
  } catch (error) {
    console.log('Error inside deleteMediaFromCloudinary:', error);
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

export { cloudinary, uploadMediaToCloudinary, deleteMediaFromCloudinary };
