const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/products', authMiddleware ,productController.createProduct);


router.delete('/users/:userId',authMiddleware ,adminController.deleteUser);


router.get('/users',authMiddleware ,adminController.listUsers);


router.patch('/products/:productId', authMiddleware,productController.updateProduct);


router.delete('/products/:productId', authMiddleware,productController.deleteProduct);


router.get('/users/:userId',authMiddleware ,adminController.getUserById);




module.exports = router;
