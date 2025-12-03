import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'User Not Found',
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);

      if (error.name == 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Token has Expired',
        });
      }

      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'not authorized, token failed',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'not authorized, No token',
    });
  }
};

export default protect;
