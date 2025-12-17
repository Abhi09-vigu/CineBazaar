export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  // Normalize common known errors to helpful statuses
  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Multer (file upload) errors → 400 Bad Request
  if (err?.name === 'MulterError' || err?.message?.includes('Only image files are allowed')) {
    statusCode = 400;
  }

  // Mongoose validation errors → 400 Bad Request
  if (err?.name === 'ValidationError') {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
