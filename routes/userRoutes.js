// routes/userRoutes.js

const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const router = express.Router();


router.post(
  '/register',
  [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  userController.registerUser
);

module.exports = router;
