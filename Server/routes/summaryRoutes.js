const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { createSummarySchema } = require('../validation/summaryValidation');

router.get('/', summaryController.getAllSummaries);
router.get('/:id', summaryController.getSummaryById);

router.post(
  '/',
  protect,
  upload.single('file'),
  validate(createSummarySchema),
  summaryController.createSummary
);

router.put('/:id', protect, summaryController.updateSummary);
router.delete('/:id', protect, summaryController.deleteSummary);

module.exports = router;