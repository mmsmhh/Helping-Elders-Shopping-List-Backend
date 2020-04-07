const router = require('express-promise-router')();
const userController = require('../controllers/user');
const { validateBody, userSchemas } = require('../middlewares/validation');
const isAuthenticated = require('../middlewares/isAuthenticated');
const upload = require('../middlewares/upload');

router.route('/sign-up').post(validateBody(userSchemas.signUp), userController.signUp);
router.route('/sign-in').post(validateBody(userSchemas.signIn), userController.signIn);
router.route('/verify-email').post(validateBody(userSchemas.verifyEmail), userController.verifyEmail);
router.route('/update-profile-picture').patch(isAuthenticated, upload.uploadImage('profile-picture'), userController.updateProfilePicture);
router.route('/remove-profile-picture').post(isAuthenticated, userController.removeProfilePicture);
router.route('/update-phone-number').patch(isAuthenticated, validateBody(userSchemas.updatePhoneNumber), userController.updatePhoneNumber);
router.route('/verify-phone-number').post(isAuthenticated, validateBody(userSchemas.verifyPhoneNumber), userController.verifyPhoneNumber);
router.route('/forget-password').post(validateBody(userSchemas.forgetPassword), userController.forgetPassword);
router.route('/reset-password').patch(validateBody(userSchemas.resetPassword), userController.resetPassword);
router.route('/update-profile').patch(isAuthenticated, validateBody(userSchemas.updateProfile), userController.updateProfile);
router.route('/update-password').patch(isAuthenticated, validateBody(userSchemas.updatePassword), userController.updatePassword);
router.route('/profile').get(isAuthenticated, userController.getProfile);
router.route('/getUser/:id').get(isAuthenticated, userController.getUser);


module.exports = router;
