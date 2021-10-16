const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router
  .route('/:articleId')
  .post(commentController.create)
  .get(commentController.getAll);

router
  .route('/:articleId/:commentId')
  .patch(commentController.update)
  .delete(commentController.delete);

module.exports = router;
