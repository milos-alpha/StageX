const express = require('express');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplicationStatus,
  deleteApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    protect,
    authorize('employer', 'admin'),
    getApplications
  )
  .post(protect, authorize('student'), createApplication);

router
  .route('/:id')
  .get(protect, getApplication)
  .put(protect, authorize('employer', 'admin'), updateApplicationStatus)
  .delete(protect, deleteApplication);

module.exports = router;