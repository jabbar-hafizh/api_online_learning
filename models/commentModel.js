const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  articleId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Article',
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
