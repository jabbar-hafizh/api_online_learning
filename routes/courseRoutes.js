const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.route('/').post(courseController.create).get(courseController.getAll);

router.get('/statistics', courseController.getStats);

router.route('/:id').get(courseController.get).patch(courseController.update);

router.patch('/:id/delete', courseController.delete);

module.exports = router;
