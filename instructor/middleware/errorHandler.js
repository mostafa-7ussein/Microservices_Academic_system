// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.details.map(detail => ({
        field: detail.path.join("."),
        message: detail.message
      }))
    });
  }

  // Sequelize errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      success: false,
      message: "Database validation error",
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry",
      error: err.errors[0]?.message || "This record already exists"
    });
  }

  // Default error
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

// 404 handler
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
