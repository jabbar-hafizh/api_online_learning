const express = require('express');
const router = express.Router();

const courseCategoryController = require('../controllers/courseCategoryController');
const authController = require('../controllers/authController');

router.get('/popular', courseCategoryController.getPopular);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    courseCategoryController.create
  )
  .get(courseCategoryController.getAll);

router
  .route('/:id')
  .get(courseCategoryController.get)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    courseCategoryController.update
  );

router.patch(
  '/:id/delete',
  authController.protect,
  authController.restrictTo('admin'),
  courseCategoryController.delete
);

module.exports = router;
