const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  desc: String,
  price: Number,
  isPremium: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  courseCategoryId: {
    type: mongoose.Schema.ObjectId,
    ref: 'course_category',
  },
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;
