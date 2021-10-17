const APIFeatures = require('../utils/apiFeatures');
const response = require('../utils/response');
const common = require('../utils/common');

const Course = require('../models/courseModel');

exports.create = async (req, res, next) => {
  try {
    const filteredBody = common.filterObj(req.body, [
      'name',
      'desc',
      'price',
      'isPremium',
      'isDeleted',
      'courseCategoryId',
    ]);

    const newCourse = await Course.create(filteredBody);

    if (!newCourse) {
      return response.responseFailed(res);
    }

    const course = {
      course: newCourse,
    };

    return response.responseSuccess(res, course, 'OK', 201);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      Course.find({ isDeleted: false }).populate({
        path: 'courseCategoryId',
      }),
      req.query
    )
      .sort()
      .paginate()
      .filter();

    const doc = await features.query;
    const courseCategories = {
      total: doc.length,
      courseCategories: doc,
    };

    return response.responseSuccess(res, courseCategories);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }

    const doc = await Course.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate({
      path: 'courseCategoryId',
    });

    if (!doc) {
      return response.responseFailed(res, 'no data found');
    }

    const course = {
      course: doc,
    };

    return response.responseSuccess(res, course);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }

    const doc = await Course.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!doc) {
      return response.responseFailed(res, 'no data found');
    }

    const course = {
      course: doc,
    };

    return response.responseSuccess(res, course);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }
    const filteredBody = common.filterObj(req.body, [
      'name',
      'desc',
      'price',
      'isPremium',
      'isDeleted',
      'courseCategoryId',
    ]);

    const updateCourse = await Course.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      filteredBody,
      { new: true }
    ).populate({
      path: 'courseCategoryId',
    });

    if (!updateCourse) {
      return response.responseFailed(res);
    }

    const course = {
      course: updateCourse,
    };

    return response.responseSuccess(res, course);
  } catch (err) {
    next(err);
  }
};
