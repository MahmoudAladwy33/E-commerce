const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/create', authMiddleware, orderController.createOrder);

router.delete('/:orderId', authMiddleware, orderController.deleteOrder);

router.get('/', authMiddleware, orderController.getOrder);

router.post('/:orderId', authMiddleware, orderController.confirmOrder);

router.delete('/:orderId/products/:productId', orderController.removeProductFromOrder);

module.exports = router;
