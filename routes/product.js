const router = require('express').Router();
const isAuth = require('../middleware/is-auth');
const { param, body } = require('express-validator');
const productControllers = require('../controllers/product');

router.get('/', isAuth, productControllers.getAll);

router.get('/cart', isAuth, productControllers.getCart);

router.get('/:id', [
  param('id').isMongoId()
], isAuth, productControllers.getById);

router.post('/', [
  body('title').isString(),
  body('description').isString(),
  body('price').isFloat()
], isAuth, productControllers.postCreate);

router.post('/add-to-cart', [
  body('productId').isMongoId()
], isAuth, productControllers.postAddToCart);

// the following endpoint reduces the quantity of product in the cart by 1 
router.post('/decrement-quantity', [
  body('productId').isMongoId()
], isAuth, productControllers.postDecementQuantity);

router.post('/remove-from-cart', [
  body('productId').isMongoId()
], isAuth, productControllers.postRemoveFromCart);

router.put('/:id', [
  param('id').isMongoId(),
  body('title').isString(),
  body('description').isString(),
  body('price').isFloat()
], isAuth, productControllers.putUpdateById);

router.delete('/:id', [
  param('id').isMongoId()
], isAuth, productControllers.deleteById);

module.exports = router;