const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/emailService');
const path = require('path');

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
  req.body.applicant = req.user.id;
  req.body.job = req.params.jobId;

  if (req.user.role !== 'student' && req.user.role !== 'employee') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to apply for jobs`, 401)
    );
  }

  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.jobId}`, 404)
    );
  }
  if (job.deadline < Date.now()) {
    return next(
      new ErrorResponse(`The application deadline for this job has passed`, 400)
    );
  }
  const existingApplication = await Application.findOne({
    job: req.params.jobId,
    applicant: req.user.id
  });
  if (existingApplication) {
    return next(
      new ErrorResponse(`User has already applied for this job`, 400)
    );
  }

  // Handle file uploads
  if (!req.files || !req.files.resume) {
    return next(new ErrorResponse('Please upload a resume file', 400));
  }
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/csv',
    'text/plain',
    'image/jpeg', 'image/png', 'image/gif'
  ];
  const resumeFile = req.files.resume;
  if (!allowedTypes.includes(resumeFile.mimetype)) {
    return next(new ErrorResponse('Invalid resume file type', 400));
  }
  const maxSize = process.env.MAX_FILE_UPLOAD || 5 * 1024 * 1024;
  if (resumeFile.size > maxSize) {
    return next(new ErrorResponse(`Please upload a file less than ${maxSize} bytes`, 400));
  }
  const resumeExt = resumeFile.name.substring(resumeFile.name.lastIndexOf('.'));
  resumeFile.name = `resume_${req.user.id}_${Date.now()}${resumeExt}`;
  const resumePath = path.join(__dirname, '../public/uploads/', resumeFile.name);
  await resumeFile.mv(resumePath);
  req.body.resume = resumeFile.name;

  // Optional cover letter
  if (req.files && req.files.coverLetter) {
    const coverLetterFile = req.files.coverLetter;
    if (!allowedTypes.includes(coverLetterFile.mimetype)) {
      return next(new ErrorResponse('Invalid cover letter file type', 400));
    }
    if (coverLetterFile.size > maxSize) {
      return next(new ErrorResponse(`Please upload a file less than ${maxSize} bytes`, 400));
    }
    const coverExt = coverLetterFile.name.substring(coverLetterFile.name.lastIndexOf('.'));
    coverLetterFile.name = `cover_${req.user.id}_${Date.now()}${coverExt}`;
    const coverPath = path.join(__dirname, '../public/uploads/', coverLetterFile.name);
    await coverLetterFile.mv(coverPath);
    req.body.coverLetter = coverLetterFile.name;
  }

  // Set status to 'active' for internship applications
  req.body.status = 'active';

  const application = await Application.create(req.body);
  await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicants: 1 } });
  const employer = await User.findById(job.postedBy);
  const message = `You have received a new application for your job posting "${job.title}".`;
  await sendEmail({ email: employer.email, subject: 'New Job Application', message });
  res.status(201).json({ success: true, data: application });
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