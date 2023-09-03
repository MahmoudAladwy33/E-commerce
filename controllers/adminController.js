const Product = require('../models/product');
const User = require('../models/user');
const { NotFoundError, CustomError } = require('../customError'); 


    

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const targetUser = await User.findById(userId);

  if (!req.userData.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Only admin can delete user' });
  }

  if (userId === req.userData.userId) {
    return res.status(403).json({ error: 'You cannot delete your own account' });
  }

  if (targetUser.isAdmin && req.userData.isAdmin) {
    return res.status(403).json({ error: 'Admins cannot delete other admins' });
  }

  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      throw new NotFoundError('User not found');
    }

    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.listUsers = async (req, res) => {

  if (!req.userData.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Only admin can list user' });
  }

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode || 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.userId;

  if (!req.userData.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Only admin can get user' });
  }


  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

