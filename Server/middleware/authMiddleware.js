const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects private routes by verifying the JWT token sent in the Authorization header.
 * If the token is valid, the authenticated user is attached to req.user for the next middleware/controller.
 *
 * @param {import('express').Request} req - The request object containing the Authorization header.
 * @param {import('express').Response} res - The response object used to return unauthorized errors.
 * @param {import('express').NextFunction} next - The next middleware function in the Express chain.
 * @returns {Promise<void>} Continues to the next middleware if authorized, or sends a 401 error response.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract the JWT token from the "Bearer <token>" Authorization header.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      '-password -profileImageData -profileImageMimeType'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store the authenticated user on the request object for protected controllers.
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired'
    });
  }
};

module.exports = {
  protect
};