const router = require('express-promise-router')();
const shoppingListController = require('../controllers/shoppingList');
const { validateBody, shoppingListSchemas } = require('../middlewares/validation');

module.exports = router;
