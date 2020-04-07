const router = require('express-promise-router')();
const shoppingListController = require('../controllers/shoppingList');
const { validateBody, shoppingListSchemas } = require('../middlewares/validation');

router.route('/create/').post(validateBody(shoppingListSchemas.create), shoppingListController.create);
router.route('/update/:id').patch(validateBody(shoppingListSchemas.update), shoppingListController.update);
router.route('/delete/:id').delete(shoppingListController.delete);
router.route('/getAll/').get(shoppingListController.getAll);
router.route('/getMyShoppingLists/:id').get(shoppingListController.getMyShoppingLists);
router.route('/getMyVolunteerShoppingLists/:id').get(shoppingListController.getMyVolunteerShoppingLists);

router.route('/buy/:id').post(shoppingListController.buy);
router.route('/unbuy/:id').post(shoppingListController.unbuy);

module.exports = router;
