const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Generates a JWT token for an authenticated user.
 *
 * @param {Object} user - The user document from MongoDB.
 * @param {string} user._id - The user's MongoDB ID.
 * @param {string} user.role - The user's role in the system.
 * @returns {string} A signed JWT token.
 */
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

/**
 * Registers a new user in the system.
 * The password is hashed before saving, and a JWT token is returned after successful registration.
 *
 * @param {import('express').Request} req - The request object containing name, email, password, university, and major.
 * @param {import('express').Response} res - The response object used to return the created user and token.
 * @returns {Promise<void>} Sends a JSON response with the new user data or an error message.
 */
const register = async (req, res) => {
  try {
    const { name, email, password, university, major } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash the password before storing it so plain-text passwords are never saved.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      university,
      major
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Logs an existing user into the system.
 * The function finds the user by email, compares the submitted password with the hashed password,
 * and returns a JWT token if the credentials are valid.
 *
 * @param {import('express').Request} req - The request object containing email and password.
 * @param {import('express').Response} res - The response object used to return the user and token.
 * @returns {Promise<void>} Sends a JSON response with authentication data or an error message.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Password has select: false in the User model, so it must be explicitly selected for login.
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Returns the currently authenticated user.
 * The req.user value is added earlier by the JWT protection middleware.
 *
 * @param {import('express').Request} req - The request object containing the authenticated user on req.user.
 * @param {import('express').Response} res - The response object used to return the current user.
 * @returns {Promise<void>} Sends the current logged-in user's data.
 */
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Updates the authenticated user's profile image.
 * The uploaded image is received from Multer and stored in MongoDB as Buffer data.
 *
 * @param {import('express').Request} req - The request object containing req.file and req.user.
 * @param {import('express').Response} res - The response object used to return the updated user.
 * @returns {Promise<void>} Sends the updated user data or an error message.
 */
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Profile image is required'
      });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed for profile picture'
      });
    }

    const profileImage = `/api/auth/profile-image/${req.user._id}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profileImage,
        profileImageData: req.file.buffer,
        profileImageMimeType: req.file.mimetype
      },
      { new: true, runValidators: true }
    ).select('-password -profileImageData');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Retrieves a user's profile image from MongoDB.
 * The image is sent back with the correct MIME type so the browser can display it.
 *
 * @param {import('express').Request} req - The request object containing the user ID in req.params.id.
 * @param {import('express').Response} res - The response object used to send the image file.
 * @returns {Promise<void>} Sends the stored profile image or a not found/error response.
 */
const getProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      'profileImageData profileImageMimeType'
    );

    if (!user || !user.profileImageData) {
      return res.status(404).send('Profile image not found');
    }

    // Set response headers so the browser treats the stored Buffer as an image file.
    res.set('Content-Type', user.profileImageMimeType || 'image/jpeg');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');    res.send(user.profileImageData);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/**
 * Logs a user in with Google OAuth.
 * The Google credential is verified, then the user is either found in MongoDB or created automatically.
 *
 * @param {import('express').Request} req - The request object containing the Google credential.
 * @param {import('express').Response} res - The response object used to return the user and JWT token.
 * @returns {Promise<void>} Sends authentication data or a Google login error response.
 */
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify that the Google credential was issued for this application's Google Client ID.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const name = payload.name || email;
    const profileImage = payload.picture || '';

    let user = await User.findOne({ email });

    if (!user) {
      // Google users still need a password field in the schema, so a secure random value is generated.
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        university: 'Bar-Ilan University',
        major: 'Information Science',
        profileImage
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Google login failed'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfileImage,
  getProfileImage,
  googleLogin
};