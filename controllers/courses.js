const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../util/errorResponse');



// @Descrition   get courses bootcamp
// @route        DELELE /api/v1/courses
// @access       public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      total: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @Descrition   get course
// @route        GET /api/v1/courses/:id
// @access       private
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`resources not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @Descrition   create course
// @route        POST /api/v1/courses
// @access       private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`resources not found with id ${req.params.id}`, 404)
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to add a course`,
        401
      )
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @Descrition   update course
// @route        PUT /api/v1/courses/:id
// @access       private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`resources not found with id ${req.params.id}`, 404)
    );
  }

  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to update a course`,
        401
      )
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: course });
});

// @Descrition   delete course
// @route        GET /api/v1/courses/:id
// @access       private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`resources not found with id ${req.params.id}`, 404)
    );
  }
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to delete  a course`,
        401
      )
    );
  }
  await course.remove();
  res.status(200).json({ success: true, data: {} });
});
