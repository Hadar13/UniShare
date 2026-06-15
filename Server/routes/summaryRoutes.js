const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summaryController');

router.get('/', summaryController.getAllSummaries);
router.post('/', summaryController.createSummary);

module.exports = router;
