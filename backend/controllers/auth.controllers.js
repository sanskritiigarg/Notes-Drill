import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        error:
          existingUser.email === email ? 'Email is already registered' : 'Username already taken',
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      statusCode: 201,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
        token,
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'User Not found',
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const id = req.user._id;

    const user = await User.findById(id);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User found',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { email, username, profileImage } = req.body;

    const user = await User.findById(req.user._id);

    if (username) user.username = username;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile Updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { newPassword, currPassword } = req.body;

    if (!currPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Please provide new and current passwords',
      });
    }

    const user = await User.findOne(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Provide correct password',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, getProfile, updateProfile, changePassword };
