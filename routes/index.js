const router = require('express-promise-router')();
const isAuthenticated = require('../middlewares/isAuthenticated');
const userRoutes = require('./user');
const shoppingListRoutes = require('./shoppingList');

router.use('/user', userRoutes);
router.use('/shopping-list', isAuthenticated, shoppingListRoutes);

module.exports = router;
