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

/**
 * @swagger
 * /api/v1/bootcamps/radius/{zipcode}/{distance}:
 *   get:
 *     summary: Get bootcamps within a radius in miles
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: path
 *         name: zipcode
 *         required: true
 *         schema:
 *           type: string
 *         example: '02118'
 *       - in: path
 *         name: distance
 *         required: true
 *         schema:
 *           type: number
 *         example: 10
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

/**
 * @swagger
 * /api/v1/bootcamps/{id}/photo:
 *   put:
 *     summary: Upload photo for bootcamp
 *     tags: [Bootcamps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *       400:
 *         description: Bad request (not an image or file too large)
 *       401:
 *         description: Not authorized
 */
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

/**
 * @swagger
 * /api/v1/bootcamps:
 *   get:
 *     summary: Get all bootcamps with pagination and filters
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Fields to include (comma-separated)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (comma-separated)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of bootcamps
 *   post:
 *     summary: Create new bootcamp
 *     tags: [Bootcamps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - address
 *               - careers
 *             properties:
 *               name:
 *                 type: string
 *                 example: Modern Fullstack Bootcamp
 *               description:
 *                 type: string
 *                 example: Intensive fullstack program with career coaching
 *               website:
 *                 type: string
 *                 example: https://modernfullstack.com
 *               phone:
 *                 type: string
 *                 example: (555) 555-5555
 *               email:
 *                 type: string
 *                 example: enroll@modernfullstack.com
 *               address:
 *                 type: string
 *                 example: 233 Bay State Rd Boston MA 02215
 *               careers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [Web Development, UI/UX]
 *               housing:
 *                 type: boolean
 *                 example: false
 *               jobAssistance:
 *                 type: boolean
 *                 example: true
 *               jobGuarantee:
 *                 type: boolean
 *                 example: false
 *               acceptGi:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Bootcamp created
 *       400:
 *         description: Validation error or user already published bootcamp
 *       401:
 *         description: Not authorized
 */
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcampAll)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

/**
 * @swagger
 * /api/v1/bootcamps/{id}:
 *   get:
 *     summary: Get single bootcamp by ID
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bootcamp data
 *       404:
 *         description: Bootcamp not found
 *   put:
 *     summary: Update bootcamp
 *     tags: [Bootcamps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Bootcamp updated
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Bootcamp not found
 *   delete:
 *     summary: Delete bootcamp
 *     tags: [Bootcamps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bootcamp deleted
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Bootcamp not found
 */
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
