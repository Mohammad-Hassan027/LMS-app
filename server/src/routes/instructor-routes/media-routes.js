import { Router } from 'express';
import {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} from '../../utils/cloudinary.js';
import multer from 'multer';

const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file found. Ensure form-data key is named 'file'.",
    });
  }

  try {
    const filePath = req.file.path;
    const result = await uploadMediaToCloudinary(filePath);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Media uploaded successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/delete/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    const { type } = req.query;

    if (!publicId) {
      return res
        .status(400)
        .json({ success: false, message: 'Public ID is required' });
    }
    const result = await deleteMediaFromCloudinary(publicId, type);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/bulk-upload', upload.array('files', 10), async (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: "No file found. Ensure form-data key is named 'files'.",
    });
  }

  try {
    const uploadPromises = req.files.map((file) =>
      uploadMediaToCloudinary(file.path)
    );
    const result = await Promise.all(uploadPromises);
    res.status(200).json({
      success: true,
      data: result,
      message: 'Media uploaded successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
