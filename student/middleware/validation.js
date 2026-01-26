import Joi from "joi";

// Validation schema for getting a course by ID
export const getCourseSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      "number.base": "Course ID must be a number",
      "number.integer": "Course ID must be an integer",
      "number.positive": "Course ID must be positive",
      "any.required": "Course ID is required"
    })
});

// Validation middleware for query parameters
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join("."),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    req.query = value;
    next();
  };
};

// Validation middleware for body
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join("."),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors
      });
    }

    req.body = value;
    next();
  };
};
