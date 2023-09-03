const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();
const authMiddlewar = require('../middleware/authMiddleware');


router.get('/',productController.getProducts);


router.get('/:productId',authMiddlewar ,productController.getProductById);



module.exports = router;
