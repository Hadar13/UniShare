const Summary = require('../models/Summary');
require('../models/User');

// Get all summaries
const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find()
      .select('-fileData')
      .populate('uploader', 'name email');

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
    const hasUploadedFile = !!req.file;

    if (!hasUploadedFile && !req.body.fileUrl) {
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
      fileUrl: hasUploadedFile ? 'pending' : req.body.fileUrl,
      fileData: hasUploadedFile ? req.file.buffer : undefined,
      fileMimeType: hasUploadedFile ? req.file.mimetype : undefined,
      fileOriginalName: hasUploadedFile ? req.file.originalname : undefined,
      uploader: req.user._id
    });

    if (hasUploadedFile) {
      newSummary.fileUrl = `/api/summaries/${newSummary._id}/file`;
      await newSummary.save();
    }

    const populatedSummary = await Summary.findById(newSummary._id)
      .select('-fileData')
      .populate('uploader', 'name email');

    res.status(201).json({
      success: true,
      data: populatedSummary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get uploaded file from MongoDB
const getSummaryFile = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id).select(
      'fileData fileMimeType fileOriginalName'
    );

    if (!summary || !summary.fileData) {
      return res.status(404).send('File not found');
    }

    const safeFileName = (summary.fileOriginalName || 'summary-file').replace(
      /["\r\n]/g,
      ''
    );

    res.set('Content-Type', summary.fileMimeType || 'application/octet-stream');
    res.set('Content-Disposition', `inline; filename="${safeFileName}"`);
    res.send(summary.fileData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get single summary by id
const getSummaryById = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id)
      .select('-fileData')
      .populate('uploader', 'name email');

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
    )
      .select('-fileData')
      .populate('uploader', 'name email');

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
  getSummaryFile,
  getSummaryById,
  updateSummary,
  deleteSummary
};