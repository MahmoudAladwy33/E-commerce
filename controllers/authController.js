const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { NotFoundError, CustomError } = require('../customError');
const config = require('../config');


exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError('Validation failed', 422);
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin }, 
      config.JWT_SECRET,
      { expiresIn: '3h' }
    );

    res.status(200).json({ token, isAdmin: user.isAdmin }); 
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
