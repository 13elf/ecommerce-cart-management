const { validationResult } = require('express-validator');

exports.validate = (req) => {
  const results = validationResult(req);
  const arr = results.array();
  if (arr.length > 0) {
    const error = new Error();
    error.statusCode = 422;
    error.message = 'Validation error';
    error.errors = arr;
    throw error;
  }
}