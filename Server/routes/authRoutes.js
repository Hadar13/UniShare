const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.get('/me', protect, authController.getMe);

router.put(
  '/profile-image',
  protect,
  upload.single('file'),
  authController.updateProfileImage
);

module.exports = router;