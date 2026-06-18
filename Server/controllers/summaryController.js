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

    const fileUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.fileUrl;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    const newSummary = await Summary.create({
      courseName: req.body.courseName,
      university: req.body.university,
      subject: req.body.subject,
      description: req.body.description,
      fileUrl: fileUrl,
      uploader: req.user._id
    });

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
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    if (summary.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this summary'
      });
    }

    const updatedSummary = await Summary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    if (summary.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this summary'
      });
    }

    await Summary.findByIdAndDelete(req.params.id);

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
