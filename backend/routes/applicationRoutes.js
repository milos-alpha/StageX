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
    authorize('employer'),
    getApplications
  )
  .post(protect, authorize('student', 'employee'), createApplication);

router
  .route('/:id')
  .get(protect, getApplication)
  .put(protect, authorize('employer'), updateApplicationStatus)
  .delete(protect, deleteApplication);

module.exports = router;