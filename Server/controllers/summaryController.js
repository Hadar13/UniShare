const Summary = require('../models/Summary');
require('../models/User');

/**
 * Retrieves all summaries from the database.
 * The uploaded file buffer is excluded from the response to keep the API response lightweight.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object used to return all summaries.
 * @returns {Promise<void>} Sends a JSON response with all summaries or an error message.
 */
const getAllSummaries = async (req, res) => {
  try {
    const summaries = await Summary.find()
      // Exclude fileData because files are served separately through the file endpoint.
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

/**
 * Creates a new summary with an uploaded file.
 * The file is received by Multer and stored in MongoDB as Buffer data.
 *
 * @param {import('express').Request} req - The request object containing summary fields, req.file, and req.user.
 * @param {import('express').Response} res - The response object used to return the created summary.
 * @returns {Promise<void>} Sends a JSON response with the created summary or an error message.
 */
const createSummary = async (req, res) => {
  try {
    if (!req.file) {
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
      fileUrl: 'pending',
      fileData: req.file.buffer,
      fileMimeType: req.file.mimetype,
      fileOriginalName: req.file.originalname,
      uploader: req.user._id
    });

    // The file URL depends on the MongoDB ID, so it is added after the summary is created.
    newSummary.fileUrl = `/api/summaries/${newSummary._id}/file`;
    await newSummary.save();

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

/**
 * Retrieves an uploaded summary file from MongoDB.
 * The stored MIME type and original filename are used so the browser can open the file correctly.
 *
 * @param {import('express').Request} req - The request object containing the summary ID in req.params.id.
 * @param {import('express').Response} res - The response object used to send the file.
 * @returns {Promise<void>} Sends the uploaded file or a not found/error response.
 */
const getSummaryFile = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id).select(
      'fileData fileMimeType fileOriginalName'
    );

    if (!summary || !summary.fileData) {
      return res.status(404).send('File not found');
    }

    // Remove characters that can break the Content-Disposition header.
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

/**
 * Retrieves a single summary by its ID.
 * The file buffer is excluded, and uploader details are populated for display.
 *
 * @param {import('express').Request} req - The request object containing the summary ID in req.params.id.
 * @param {import('express').Response} res - The response object used to return the summary.
 * @returns {Promise<void>} Sends a JSON response with the summary or an error message.
 */
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

/**
 * Updates an existing summary by ID.
 * Only the original uploader is allowed to update the summary details.
 *
 * @param {import('express').Request} req - The request object containing updated summary fields and req.user.
 * @param {import('express').Response} res - The response object used to return the updated summary.
 * @returns {Promise<void>} Sends a JSON response with the updated summary or an error message.
 */
const updateSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    // Ownership check: users can only update summaries they uploaded.
    if (summary.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this summary'
      });
    }

    // Only editable text fields are updated; file data and uploader cannot be changed here.
    const allowedUpdates = {
      courseName: req.body.courseName,
      university: req.body.university,
      subject: req.body.subject,
      description: req.body.description
    };

    const updatedSummary = await Summary.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
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

/**
 * Deletes an existing summary by ID.
 * Only the original uploader is allowed to delete the summary.
 *
 * @param {import('express').Request} req - The request object containing the summary ID and authenticated user.
 * @param {import('express').Response} res - The response object used to return the deletion result.
 * @returns {Promise<void>} Sends a JSON response confirming deletion or an error message.
 */
const deleteSummary = async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Summary not found'
      });
    }

    // Ownership check: users can only delete summaries they uploaded.
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