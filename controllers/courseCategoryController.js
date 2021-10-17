const APIFeatures = require('../utils/apiFeatures');
const response = require('../utils/response');
const common = require('../utils/common');

const CourseCategory = require('../models/courseCategoryModel');
const Course = require('../models/courseModel');

exports.create = async (req, res, next) => {
  try {
    const filteredBody = common.filterObj(req.body, [
      'name',
      'desc',
      'isDeleted',
    ]);

    const courseCategories = await CourseCategory.find({ isDeleted: false });
    if (courseCategories && courseCategories.length && req.body.name) {
      for (let courseCategory of courseCategories) {
        if (courseCategory.name) {
          if (courseCategory.name === req.body.name) {
            return response.responseFailed(
              res,
              'name of category can not be same'
            );
          }
        }
      }
    }

    const newCourseCategory = await CourseCategory.create(filteredBody);

    if (!newCourseCategory) {
      return response.responseFailed(res);
    }

    const courseCategory = {
      courseCategory: newCourseCategory,
    };

    return response.responseSuccess(res, courseCategory, 'OK', 201);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const features = new APIFeatures(
      CourseCategory.find({ isDeleted: false }),
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

    const doc = await CourseCategory.findOne({
      _id: req.params.id,
      isDeleted: false,
    });
    if (!doc) {
      return response.responseFailed(res, 'no data found');
    }
    const courseCategory = {
      courseCategory: doc,
    };

    return response.responseSuccess(res, courseCategory);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }

    const doc = await CourseCategory.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        isDeleted: true,
      },
      { new: true }
    );

    if (!doc) {
      return response.responseFailed(res, 'no data found');
    }

    const courseCategory = {
      courseCategory: doc,
    };

    return response.responseSuccess(res, courseCategory);
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
      'isDeleted',
    ]);

    const courseCategories = await CourseCategory.find({ isDeleted: false });
    if (courseCategories && courseCategories.length && req.body.name) {
      for (let courseCategory of courseCategories) {
        if (String(courseCategory._id) === String(req.params.id)) {
          continue;
        }
        if (courseCategory.name) {
          if (courseCategory.name === req.body.name) {
            return response.responseFailed(
              res,
              'name of category can not be same'
            );
          }
        }
      }
    }

    const updateCourseCategory = await CourseCategory.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      filteredBody,
      { new: true }
    );

    if (!updateCourseCategory) {
      return response.responseFailed(res);
    }

    const courseCategory = {
      courseCategory: updateCourseCategory,
    };

    return response.responseSuccess(res, courseCategory);
  } catch (err) {
    next(err);
  }
};

exports.getPopular = async (req, res, next) => {
  try {
    const aggregateQuery = [{ $match: { isDeleted: false } }];
    aggregateQuery.push({
      $lookup: {
        from: 'courses',
        localField: '_id',
        foreignField: 'courseCategoryId',
        as: 'cateogryCourses',
      },
    });

    if (req.query) {
      const sort = {};
      sort.cateogryCourses = -1;

      if (Object.keys(sort).length > 0) {
        aggregateQuery.push({ $sort: sort });
      }
    }

    let courseCategories = await CourseCategory.aggregate(aggregateQuery);

    const courseCategoriesObject = {
      total: courseCategories.length,
      courseCategories: courseCategories,
    };

    return response.responseSuccess(res, courseCategoriesObject);
  } catch (error) {
    next(error);
  }
};
