const mongoose = require('mongoose');

const courseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  desc: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const CourseCategory = mongoose.model('course_category', courseCategorySchema);
module.exports = CourseCategory;
