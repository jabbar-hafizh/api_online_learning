const Article = require('../models/articleModel');
const base = require('./baseController');

exports.create = base.createOne(Article);
exports.getAll = base.getAll(Article);
exports.get = base.getOne(Article);
exports.update = base.updateOne(Article);
exports.delete = base.deleteOne(Article);
