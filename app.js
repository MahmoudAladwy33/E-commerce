const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const connectToDatabase = require("./db");
const errorHandler = require('./errorMiddleware');
const config = require('./config');
require('dotenv').config();
const orderRoutes = require('./routes/orderRoutes');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());

connectToDatabase(); 

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.use(errorHandler); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
