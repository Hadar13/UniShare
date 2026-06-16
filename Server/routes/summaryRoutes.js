const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summaryController');

router.get('/', summaryController.getAllSummaries);
router.post('/', summaryController.createSummary);
router.get('/:id', summaryController.getSummaryById);
router.put('/:id', summaryController.updateSummary);
router.delete('/:id', summaryController.deleteSummary);


module.exports = router;
