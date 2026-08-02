const express = require('express');
const multer = require('multer');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed for profile picture'), false);
  }
};

const uploadProfileImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);

router.get('/me', protect, authController.getMe);
router.get('/profile-image/:id', authController.getProfileImage);

router.put(
  '/profile-image',
  protect,
  uploadProfileImage.single('file'),
  authController.updateProfileImage
);

module.exports = router;