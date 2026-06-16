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
// Get single summary by id
const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id).populate('uploader', 'name email');

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update summary by id
const updateSummary = async (req, res) => {
  try {
    const updatedSummary = await Summary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedSummary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedSummary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete summary by id
const deleteSummary = async (req, res) => {
  try {
    const deletedSummary = await Summary.findByIdAndDelete(req.params.id);

    if (!deletedSummary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllSummaries,
  createSummary,
  getSummaryById,
  updateSummary,
  deleteSummary
};
