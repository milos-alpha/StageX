const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/emailService');

// @desc    Get all applications
// @route   GET /api/applications
// @route   GET /api/jobs/:jobId/applications
// @access  Private (Admin/Employer)
exports.getApplications = asyncHandler(async (req, res, next) => {
  if (req.params.jobId) {
    const applications = await Application.find({ job: req.params.jobId })
      .populate({
        path: 'applicant',
        select: 'name email profile'
      })
      .populate({
        path: 'job',
        select: 'title'
      });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private (Admin/Employer/Applicant)
exports.getApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id)
    .populate({
      path: 'applicant',
      select: 'name email profile'
    })
    .populate({
      path: 'job',
      select: 'title company'
    });

  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is application owner or admin
  if (
    application.applicant._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    application.job.company.toString() !== req.user.id
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this application`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: application
  });
});

// @desc    Create application
// @route   POST /api/jobs/:jobId/applications
// @access  Private (Student)
exports.createApplication = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.applicant = req.user.id;
  req.body.job = req.params.jobId;

  // Check if user is student
  if (req.user.role !== 'student') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to apply for jobs`, 401)
    );
  }

  // Check if job exists
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.jobId}`, 404)
    );
  }

  // Check if deadline has passed
  if (job.deadline < Date.now()) {
    return next(
      new ErrorResponse(`The application deadline for this job has passed`, 400)
    );
  }

  // Check if user has already applied
  const existingApplication = await Application.findOne({
    job: req.params.jobId,
    applicant: req.user.id
  });

  if (existingApplication) {
    return next(
      new ErrorResponse(`User has already applied for this job`, 400)
    );
  }

  const application = await Application.create(req.body);

  // Increment applicants count
  await Job.findByIdAndUpdate(req.params.jobId, {
    $inc: { applicants: 1 }
  });

  // Send notification email to employer
  const employer = await User.findById(job.postedBy);

  const message = `You have received a new application for your job posting "${job.title}".`;

  await sendEmail({
    email: employer.email,
    subject: 'New Job Application',
    message
  });

  res.status(201).json({
    success: true,
    data: application
  });
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer/Admin)
exports.updateApplicationStatus = asyncHandler(async (req, res, next) => {
  let application = await Application.findById(req.params.id).populate('job');

  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is employer or admin
  if (
    application.job.postedBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this application`,
        401
      )
    );
  }

  // Update status
  application = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true
    }
  );

  // Send notification email to applicant if status changed to shortlisted or rejected
  if (['shortlisted', 'rejected', 'hired'].includes(req.body.status)) {
    const applicant = await User.findById(application.applicant);

    const message = `Your application for "${application.job.title}" has been ${req.body.status}.`;

    await sendEmail({
      email: applicant.email,
      subject: `Application Update: ${application.job.title}`,
      message
    });
  }

  res.status(200).json({
    success: true,
    data: application
  });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Applicant/Admin)
exports.deleteApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(
      new ErrorResponse(`Application not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is application owner or admin
  if (
    application.applicant.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this application`,
        401
      )
    );
  }

  await application.deleteOne();

  // Decrement applicants count
  await Job.findByIdAndUpdate(application.job, {
    $inc: { applicants: -1 }
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});