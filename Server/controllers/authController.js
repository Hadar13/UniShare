const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Register new user
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      university,
      major
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
      const profileImage = `/uploads/${req.file.filename}`;
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage },
        { new: true }
      ).select('-password');
  
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
  const googleLogin = async (req, res) => {
    try {
      const { credential } = req.body;
  
      if (!credential) {
        return res.status(400).json({
          success: false,
          message: 'Google credential is required'
        });
      }
  
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
        const hashedPassword = await bcrypt.hash('google-signin-password', 10);
  
        user = await User.create({
          name,
          email,
          password: hashedPassword,
          university: 'Bar-Ilan University',
          major: 'Information Science',
          profileImage
        });
      }
  
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
      );
  
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
  googleLogin
};