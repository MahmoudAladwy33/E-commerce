const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { BadRequestError, CustomError } = require('../customError'); 


exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(422).json({ errors: errorMessages });
  }

  const { email, password, firstName, lastName, isAdmin, phoneNumber } = req.body;

  
  const nameRegex = /^[A-Za-z]{3,}$/;

  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return res.status(422).json({
      error: 'First name and last name must be at least 3 characters long and contain only letters.',
    });
  }

  
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

  if (!passwordRegex.test(password)) {
    return res.status(422).json({
      error: 'Password must contain at least one uppercase letter, one number, and one special character',
    });
  }

  
  const phoneRegex = /^(01[0-2]|015)[0-9]{8}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return res.status(422).json({
      error: 'Invalid phone number',
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new CustomError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isAdmin: isAdmin || false,
      phoneNumber,
    });

    

    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User registered', userId: savedUser._id });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
