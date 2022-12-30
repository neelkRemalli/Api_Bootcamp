const express = require('express');
const router = express.Router();

const {
  getBootcampAll,
  getBootcamp,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const CourseRouter = require('./courses');
const ReviewRouter = require('./reviews');
const {protect, authorize} = require('../middleware/auth');


const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Reroute to courses

router.use('/:bootcampId/courses', CourseRouter);
router.use('/:bootcampId/reviews', ReviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcampAll)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);


module.exports = router;
