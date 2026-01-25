import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import os from 'os';

const UPLOAD_ROOT = fs.realpathSync(os.tmpdir());

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

  // Resolve the path relative to the known upload root and normalize it
  let resolvedPath = path.resolve(UPLOAD_ROOT, filePath);

  try {
    resolvedPath = fs.realpathSync(resolvedPath);
  } catch (e) {
    throw new Error('File path is invalid or file does not exist');
  }
  // Ensure the resolved path is contained within the upload root
  if (!resolvedPath.startsWith(UPLOAD_ROOT + path.sep)) {
    throw new Error('Access to the specified file path is not allowed');
  }

  if (!fs.existsSync(resolvedPath)) {
    throw new Error('File path is invalid or file does not exist');
  }


  try {
    const result = await cloudinary.uploader.upload(resolvedPath, {
      resource_type: 'auto',
      ...options,
    });
    fs.unlinkSync(resolvedPath);
    const data = {
      url: result.secure_url,
      public_id: result.public_id,
    };
    return data;
  } catch (error) {
    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
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
