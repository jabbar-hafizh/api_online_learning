const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const User = require('../models/userModel');

const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const response = require('../utils/response');

// function bantuan untuk filter object
const filterObj = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  console.log('getMe');
  req.params.id = req.user.id;
  req.now = new Date(Date.now());
  next();
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const features = new APIFeatures(User.find({ isDeleted: false }), req.query)
      .sort()
      .paginate()
      .filter();

    const doc = await features.query;
    const users = {
      users: doc,
    };

    return response.responseSuccess(res, users);
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }

    const doc = await User.findById(req.params.id);
    if (!doc) {
      return response.responseFailed(res, 'no data found');
    }
    const user = {
      user: doc,
    };

    return response.responseSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const filteredBody = filterObj(req.body, [
      'fullname',
      'email',
      'password',
      'passwordConfirm',
      'passwordChangedAt',
      'role',
      'isDeleted',
    ]);

    if (req.file)
      // filteredBody.photo = `${req.protocol}://${req.get('host')}/img/users/${
      //   req.file.filename
      // }`;
      filteredBody.photo = `${process.env.URL}img/users/${req.file.filename}`;

    const newUser = await User.create(filteredBody);

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      code: '201',
      message: 'OK',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Don't update password on this
// exports.deleteUser = base.deleteOne(User);
exports.deleteUser = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }

    const doc = await User.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      },
      { new: true }
    );
    if (!doc) {
      return response.responseFailed(res, 'no data found');
    }
    const user = {
      user: doc,
    };

    return response.responseSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  console.log('udpateUser');
  try {
    if (!req.params.id) {
      return response.responseFailed(res, 'no id');
    }

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return response.responseFailed(res, 'cannot update password');
      // return next(new AppError('Bukan tempat untuk update password', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, ['fullname', 'photo']);
    if (req.file)
      filteredBody.photo = `${process.env.URL}img/users/${req.file.filename}`;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    const user = {
      user: updatedUser,
    };
    return response.responseSuccess(res, user);
  } catch (err) {
    next(err);
  }
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Bukan gambar!, mohon hanya upload file gambar', 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = async (req, res, next) => {
  try {
    let user;
    // ini untuk create
    if (!req.params.id) {
      user = req.body;
    }
    // ini untuk update
    else {
      user = await User.findById(req.params.id);
      if (user.photo !== 'default-user-image.png') {
        fs.unlink(`public/img/users/${user.photo}`, (err) => {
          console.error(err);
        });
      }
      if (req.body.NIP) {
        user.NIP = req.body.NIP;
      }
    }

    if (!req.file) return next();
    req.file.filename = `user-${user.role}-${user.NIP}.jpeg`.replace(/\s/g, '');
    // }-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  } catch (err) {
    next(err);
  }
};
