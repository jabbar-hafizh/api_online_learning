const express = require('express');
const router = express.Router();

const courseCategoryController = require('../controllers/courseCategoryController');

router
  .route('/')
  .post(courseCategoryController.create)
  .get(courseCategoryController.getAll);

router
  .route('/:id')
  .get(courseCategoryController.get)
  .patch(courseCategoryController.update);

router.patch('/:id/delete', courseCategoryController.delete);

module.exports = router;
