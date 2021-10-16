const Comment = require('../models/commentModel');
const base = require('./baseController');

exports.create = base.createOne(Comment);
exports.getAll = base.getAll(Comment);
exports.update = base.updateOne(Comment);
exports.delete = base.deleteOne(Comment);
