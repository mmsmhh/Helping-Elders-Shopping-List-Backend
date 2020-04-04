const router = require('express-promise-router')();
const userController = require('../controllers/user');
const { validateBody, userSchemas } = require('../middlewares/validation');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/upload');

module.exports = router;
