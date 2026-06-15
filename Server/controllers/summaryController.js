const Summary = require('../models/Summary');

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

module.exports = {
  getAllSummaries
};
