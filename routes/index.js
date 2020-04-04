const router = require('express-promise-router')();
const isAuthenticated = require('../middlewares/isAuthenticated');
const userRoutes = require('./user');
const shoppingListRoutes = require('./shoppingList');

router.use('/user', userRoutes);
router.use('/shoppingList', isAuthenticated, shoppingListRoutes);

module.exports = router;
