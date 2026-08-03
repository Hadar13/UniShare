const express = require('express');
const multer = require('multer');
const router = express.Router();

const summaryController = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createSummarySchema,
  updateSummarySchema
} = require('../validation/summaryValidation');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, Word, JPEG, PNG, and WebP files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get('/', summaryController.getAllSummaries);
router.get('/:id/file', summaryController.getSummaryFile);
router.get('/:id', summaryController.getSummaryById);

router.post(
  '/',
  protect,
  upload.single('file'),
  validate(createSummarySchema),
  summaryController.createSummary
);

router.put(
  '/:id',
  protect,
  validate(updateSummarySchema),
  summaryController.updateSummary
);router.delete('/:id', protect, summaryController.deleteSummary);

module.exports = router;