const Product = require('../models/product');
const Order = require('../models/order');
const { NotFoundError, CustomError } = require('../customError');



exports.createOrder = async (req, res) => {
  const { products } = req.body;

  try {
  
    const fetchedProducts = await Promise.all(
      products.map(async (product) => {
        const fetchedProduct = await Product.findById(product.productId);
        if (!fetchedProduct) {
          throw new CustomError(`Product not found for ID: ${product.productId}`, 404);
        }
        return {
          product: fetchedProduct,
          quantity: product.quantity,
        };
      })
    );

    
    const totalPrice = fetchedProducts.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

  
    const order = new Order({
      user: req.userData.userId,
      products: fetchedProducts.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: totalPrice,
    });

    const savedOrder = await order.save();

    res.status(201).json({ message: 'Order created', orderId: savedOrder._id, totalPrice: totalPrice });
  } catch (error) {
    
      res.status(error.statusCode || 500).json({ error: error.message });
    } 
  
};

exports.getOrder = async (req, res) => {
  const userId = req.userId;

  try {
    const orders = await Order.find({ user: userId }).populate('products.product');

    if (!orders || orders.length === 0) {
      throw new CustomError('No orders found for this user', 404);
    }

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      orderDate: order.orderDate,
      userId: order.user, 
      products: order.products.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    }));

    res.status(200).json(formattedOrders);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.statusCode || 500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


exports.deleteOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const deletedOrder = await Order.deleteOne({ _id: orderId });

    if (deletedOrder.deletedCount === 0) {
      throw new CustomError('Order not found', 404);
    }

    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.confirmOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new CustomError('Order not found', 404);
    }

    
    if (order.confirmed) {
      throw new CustomError('Order is already confirmed', 400);
    }

    
    order.confirmed = true;
    await order.save();

    
    order.products = [];
    await order.save();

    res.status(200).json({ message: 'Order confirmed ' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};


exports.removeProductFromOrder = async (req, res) => {
  const orderId = req.params.orderId;
  const productId = req.params.productId;
  
  try {
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    
    order.products = order.products.filter((item) => item.product.toString() !== productId);
    
    
    await order.save();
    
    res.status(200).json({ message: 'Product removed from order' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
