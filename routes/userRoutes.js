const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protect all routes after this middleware
// potect means, need login to access
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);

// router.use(authController.restrictTo('admin', 'user'));

// router.post(
//   '/logout',
//   authController.restrictTo('admin', 'user'),
//   authController.logout
// );
router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .post(
    authController.restrictTo('admin'),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto
  );

router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser)
  .patch(
    authController.restrictTo('admin', 'user'),
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
  );

router
  .route('/:id/delete')
  .patch(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
