const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validate } = require('../utils/validation');
const asyncHandler = require('express-async-handler');

exports.postSignup = asyncHandler(async (req, res, next) => {
  validate(req);
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email
  });

  if (user) {
    const error = Error();
    error.message = "Email already exists";
    error.statusCode = 409;
    throw error;
  }

  const hasedPass = await bcrypt.hash(password, 12);
  const createdUser = await User.create({
    email,
    password: hasedPass
  });
  res.json({ id: createdUser._id });
})


exports.postSignin = asyncHandler(async (req, res, next) => {
  validate(req);
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email
  });

  if (!user) {
    const error = Error();
    error.message = "User doesnt exists";
    error.statusCode = 404;
    throw error;
  }

  const isMatching = await bcrypt.compare(password, user.password);
  if (!isMatching) {
    const error = Error();
    error.message = "Auth failure";
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({
    userId: user.id,
    email: user.email
  }, 'secret', { expiresIn: '30m' })

  res.status(200).json({ token: token });
});