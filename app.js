const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const courseCategoryRoutes = require('./routes/courseCategoryRoutes');
const courseRoutes = require('./routes/courseRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const response = require('./utils/response');
const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: 'Too Many Request from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '15kb',
  })
);

app.use(express.urlencoded({ extended: true, limit: '15kb' }));
app.use(cookieParser());

// Data sanitization against Nosql query injection
app.use(mongoSanitize());

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// definde static path
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/course-categories', courseCategoryRoutes);
app.use('/api/v1/courses', courseRoutes);

// handle undefined Routes
app.use('*', (req, res, next) => {
  return response.responseFailed(res, 'undefined route', 404);
  // const err = new AppError(404, 'fail', 'undefined route');
  // next(err, req, res, next);
});

app.use(globalErrHandler);

module.exports = app;
