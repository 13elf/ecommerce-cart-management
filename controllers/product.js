const Product = require('../models/product');
const User = require('../models/user');
const { validate } = require('../utils/validation');
const asyncHandler = require('express-async-handler');

exports.getAll = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
});


exports.getCart = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.token.userId
  });
  if (!user) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "User not found";
    throw error;
  }
  res.json(user.cart);
})


exports.getById = asyncHandler(async (req, res, next) => {
  validate(req);
  const product = await Product.findOne({
    _id: req.params.id
  });
  res.json(product);
});


exports.postCreate = asyncHandler(async (req, res, next) => {
  validate(req);
  const { title, description, price } = req.body;
  const product = await Product.create({
    title,
    description,
    price
  });
  res.status(201).json({ message: 'Created', id: product._id });
});


// add it as a new product if it doesn exist
// if it already exists, increment the quantity by 1
exports.postAddToCart = asyncHandler(async (req, res, next) => {
  validate(req);
  const { productId } = req.body;
  const user = await User.findOne({
    _id: req.token.userId
  });

  const product = user.cart.find(e => e.productId.toString() === productId);
  if (product) {
    product.quantity = product.quantity + 1;
    await user.save();
  } else {
    await User.updateOne({ _id: req.token.userId }, {
      $addToSet: {
        cart: {
          productId: productId,
          quantity: 1
        }
      }
    })
  }
  res.json({ message: 'Updated' });
});


exports.postDecementQuantity = asyncHandler(async (req, res, next) => {
  validate(req);
  const { productId } = req.body;
  const user = await User.findOne({
    _id: req.token.userId
  });

  if (!user) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "User not found";
    throw error;
  }

  const product = user.cart.find(e => e.productId.toString() === productId);
  if (!product) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "Product not found";
    throw error;
  }
  if (product.quantity === 1) { // delete the product
    user.cart = user.cart.filter(e => e.productId.toString() !== product.productId.toString());
    await user.save();
  } else { // decrement the quantity by 1
    product.quantity = product.quantity - 1;
    await user.save();
  }
  res.json({ message: 'Updated successfully' })
})


exports.postRemoveFromCart = asyncHandler(async (req, res, next) => {
  validate(req);
  const productId = req.body.productId;
  const user = await User.findOne({
    _id: req.token.userId
  });

  /*
    the following check is to make sure product actually exists
    if it doesnt exists, we dont need to send another query to the db
    and directly return the error message
  */
  const prod = user.cart.find(e => e.productId.toString() === productId);
  if (!prod) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "Product not found";
    throw error;
  }

  user.cart = user.cart.filter(e => e.productId.toString() !== productId);
  await user.save();

  res.json({ message: "Updated" })
});


exports.putUpdateById = asyncHandler(async (req, res, next) => {
  validate(req);
  const { title, description, price } = req.body;
  const product = await Product.findOne({
    _id: req.params.id
  });
  if (!product) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "Product not found";
    throw error;
  }
  product.title = title;
  product.description = description;
  product.price = price;
  await product.save();
  res.json({ message: 'Updated' });
});


exports.deleteById = asyncHandler(async (req, res, next) => {
  validate(req);
  const product = await Product.findOne({
    _id: req.params.id
  });
  if (!product) {
    const error = new Error();
    error.statusCode = 404;
    error.message = "Product not found";
    throw error;
  }
  await product.delete();
  res.json({ message: 'Deleted' })
});