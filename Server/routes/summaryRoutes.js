const express = require('express');
const router = express.Router();

const summaryController = require('../controllers/summaryController');

router.get('/', summaryController.getAllSummaries);

module.exports = router;
