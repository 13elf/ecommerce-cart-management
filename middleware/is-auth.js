const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const header = req.headers.authorization; // Bearer <token>
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, 'secret');
    req.token = decoded;
    next();
  } catch (error) {
    error.message = "Auth failure";
    error.statusCode = 401;
    next(error);
  }
}