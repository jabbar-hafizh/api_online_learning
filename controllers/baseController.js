const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    if (req.params.commentId) {
      const doc = await Model.findByIdAndDelete(req.params.commentId);

      if (!doc) {
        res.status(404).json({
          statusCode: 404,
          success: 'fail',
          message: 'No document found with that id',
          data: null,
        });
        // return next(
        //   new AppError(404, 'fail', 'No document found with that id'),
        //   req,
        //   res,
        //   next
        // );
      }

      res.status(204).json({
        statusCode: 204,
        status: 'success',
        data: null,
      });
    } else {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        res.status(404).json({
          statusCode: 404,
          success: 'fail',
          message: 'No document found with that id',
          data: null,
        });
      }

      res.status(204).json({
        statusCode: 204,
        status: 'success',
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    if (req.params.commentId) {
      const doc = await Model.findByIdAndUpdate(
        req.params.commentId,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        res.status(404).json({
          statusCode: 404,
          success: 'fail',
          message: 'No document found with that id',
          data: null,
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: {
          doc,
        },
      });
    } else {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        res.status(404).json({
          statusCode: 404,
          success: 'fail',
          message: 'No document found with that id',
          data: null,
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: {
          doc,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    if (req.params.articleId) {
      req.body.articleId = req.params.articleId;
      const doc = await Model.create(req.body);

      res.status(201).json({
        statusCode: 201,
        status: 'success',
        data: {
          doc,
        },
      });
    } else {
      const doc = await Model.create(req.body);

      res.status(201).json({
        statusCode: 201,
        status: 'success',
        data: {
          doc,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      res.status(404).json({
        statusCode: 404,
        success: 'fail',
        message: 'No document found with that id',
        data: null,
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: 'success',
      data: {
        doc,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = (Model) => async (req, res, next) => {
  try {
    if (req.params.articleId) {
      const features = new APIFeatures(
        Model.find({ articleId: req.params.articleId }),
        req.query
      )
        .sort()
        .paginate()
        .filter();

      const doc = await features.query;

      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: {
          results: doc.length,
          doc: doc,
        },
      });
    } else {
      const features = new APIFeatures(Model.find(), req.query)
        .sort()
        .paginate()
        .filter();

      const doc = await features.query;

      res.status(200).json({
        statusCode: 200,
        status: 'success',
        data: {
          results: doc.length,
          doc: doc,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
