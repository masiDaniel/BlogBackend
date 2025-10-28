const errorHandler = (error, req, res, next) => {
  const code = error.statusCode || 500;
  res.status(code).json({
    status: code,
    message: error.message,
    stack: error.stack,
  });
};

module.exports = errorHandler;