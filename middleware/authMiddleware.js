const jwt = require('jsonwebtoken');
const config = require('../config');
const { CustomError } = require('../customError');


module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    throw new CustomError('Authorization token missing', 401);
  }

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    req.userId = decodedToken.userId;
    req.userData = { userId: decodedToken.userId, isAdmin: decodedToken.isAdmin }; 

    next();
  } catch (error) {
    throw new CustomError('Invalid token', 401);
  }
};
