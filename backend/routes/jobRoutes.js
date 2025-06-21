const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsInRadius,
  uploadJobFile
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const applicationRouter = require('./applicationRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:jobId/applications', applicationRouter);

router.route('/radius/:zipcode/:distance').get(getJobsInRadius);

router
  .route('/')
  .get(getJobs)
  .post(protect, authorize('employer'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('employer'), updateJob)
  .delete(protect, authorize('employer'), deleteJob);

router.route('/:id/upload').post(protect, authorize('employer'), uploadJobFile);

module.exports = router;