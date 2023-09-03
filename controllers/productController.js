const Product = require('../models/product');
const { NotFoundError, CustomError } = require('../customError'); // Import custom errors
const authMiddleware = require('../middleware/authMiddleware');

exports.createProduct = async (req, res) => {
  if (!req.userData.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Only admin can create products' });
  }

  const { name, description, price } = req.body;

  
  if (typeof name !== 'string' || typeof description !== 'string') {
    return res.status(400).json({ error: 'Name and description must be strings' });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      price,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created', productId: savedProduct._id });
  } catch (error) {
    
      res.status(error.statusCode || 500).json({ error: error.message });
   
  }
};



exports.getProducts = async (req, res) => {

 

  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    
      res.status(error.statusCode || 500).json({ error: error.message });
    
  }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.productId;

  

  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found'); 
    }

    res.status(200).json(product);
  } catch (error) {
   
      res.status(error.statusCode || 500).json({ error: error.message });
    
  }
};

exports.updateProduct = async (req, res) => {
  if (!req.userData.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Only admin can update products' });
  }

 const productId = req.params.productId;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    
    product.name = name;
    product.description = description;
    product.price = price;

    const updatedProduct = await product.save();
    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  if (!req.userData.isAdmin) {
    return res.status(403).json({ error: 'Unauthorized: Only admin can delete products' });
  }

 
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    await product.deleteOne();
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

