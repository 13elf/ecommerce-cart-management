const router = require('express').Router();
const { body } = require('express-validator');
const userControllers = require('../controllers/user');

router.post('/signup', [
  body('email').trim().isEmail().normalizeEmail().isLength({ max: 200 }),
  body('password').trim().isString().isLength({ max: 200 })
], userControllers.postSignup);

router.post('/signin', [
  body('email').trim().isEmail().normalizeEmail().isLength({ max: 200 }),
  body('password').trim().isString().isLength({ max: 200 })
], userControllers.postSignin);

module.exports = router;