const express = require('express');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsInRadius
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
  .post(protect, authorize('employer', 'admin'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, authorize('employer', 'admin'), updateJob)
  .delete(protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;