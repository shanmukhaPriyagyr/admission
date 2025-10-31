const errorHandler = (err, req, res, next) => {
    console.error(err); // Log error details to console for debugging
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(status).json({
      status,
      message,
      errors: err.errors || null, // Include validation errors if any
    });
  };
  
  module.exports = errorHandler;
  