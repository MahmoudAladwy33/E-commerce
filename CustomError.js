class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}


module.exports = {
  CustomError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  
};
