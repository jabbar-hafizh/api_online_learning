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
    const aggregateQuery = [{ $match: { isDeleted: false } }];
    aggregateQuery.push({
      $lookup: {
        from: 'course_categories',
        localField: 'courseCategoryId',
        foreignField: '_id',
        as: 'courseCateogry',
      },
    });

    if (req.query) {
      const queryFilter = {};

      if (req.query.filterName) {
        queryFilter.name = common.diacriticSensitiveRegex(req.query.filterName);
      }

      if (Object.keys(queryFilter).length > 0) {
        aggregateQuery.push({ $match: queryFilter });
      }
    }

    if (req.query) {
      const sort = {};

      if (req.query.sortPrice) {
        if (req.query.sortPrice === 'asc') {
          sort.price = 1;
        } else {
          sort.price = -1;
        }
      }
      if (req.query.sortIsPremium) {
        if (req.query.sortIsPremium === 'asc') {
          sort.isPremium = 1;
        } else {
          sort.isPremium = -1;
        }
      }

      if (Object.keys(sort).length > 0) {
        aggregateQuery.push({ $sort: sort });
      }
    }

    let courses = await Course.aggregate(aggregateQuery);
    const coursesObject = {
      total: courses.length,
      courses: courses,
    };

    return response.responseSuccess(res, coursesObject);
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
