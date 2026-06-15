const Summary = require('../models/Summary');
require('../models/User');

// Get all summaries
const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find().populate('uploader', 'name email');

    res.status(200).json({
      success: true,
      data: summaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new summary
const createSummary = async (req, res) => {
  try {
    const newSummary = await Summary.create(req.body);

    res.status(201).json({
      success: true,
      data: newSummary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllSummaries,
  createSummary
};
