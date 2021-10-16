const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

router.route('/')
  .post(articleController.create)
  .get(articleController.getAll);

router
  .route('/:id')
  .get(articleController.get)
  .patch(articleController.update)
  .delete(articleController.delete);

module.exports = router;
