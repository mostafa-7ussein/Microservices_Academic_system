import Joi from "joi";

// Validation schema for adding a course
export const addCourseSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      "number.base": "Course ID must be a number",
      "number.integer": "Course ID must be an integer",
      "number.positive": "Course ID must be positive",
      "any.required": "Course ID is required"
    }),
  name: Joi.string().trim().min(3).max(100).required()
    .messages({
      "string.base": "Course name must be a string",
      "string.empty": "Course name cannot be empty",
      "string.min": "Course name must be at least 3 characters",
      "string.max": "Course name must not exceed 100 characters",
      "any.required": "Course name is required"
    })
});

// Validation schema for deleting a course
export const deleteCourseSchema = Joi.object({
  id: Joi.number().integer().positive().required()
    .messages({
      "number.base": "Course ID must be a number",
      "number.integer": "Course ID must be an integer",
      "number.positive": "Course ID must be positive",
      "any.required": "Course ID is required"
    }),
  name: Joi.string().trim().min(1).optional()
    .messages({
      "string.base": "Course name must be a string"
    })
});

// Validation middleware
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

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};
