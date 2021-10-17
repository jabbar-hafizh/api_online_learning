const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authController = require('../controllers/authController');

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.create
  )
  .get(courseController.getAll);

router.get(
  '/statistics',
  authController.protect,
  authController.restrictTo('admin'),
  courseController.getStats
);

router
  .route('/:id')
  .get(courseController.get)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    courseController.update
  );

router.patch(
  '/:id/delete',
  authController.protect,
  authController.restrictTo('admin'),
  courseController.delete
);

module.exports = router;
