const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', summaryController.getAllSummaries);
router.get('/:id', summaryController.getSummaryById);

router.post('/', protect, summaryController.createSummary);
router.put('/:id', protect, summaryController.updateSummary);
router.delete('/:id', protect, summaryController.deleteSummary);


module.exports = router;
