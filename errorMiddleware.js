const { CustomError } = require('./customError');


const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  
  console.error('Unhandled Error:', err);
  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorHandler;
