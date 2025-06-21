const Job = require('../models/Job');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  const jobs = await Job.find();
  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate({
    path: 'company',
    select: 'name profile.companyLogo'
  });

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer)
exports.createJob = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.postedBy = req.user.id;
  req.body.company = req.user.id;

  // Check if user is employer
  if (req.user.role !== 'employer') {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to post a job`, 401)
    );
  }

  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: job
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
exports.updateJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is job poster
  if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this job`,
        401
      )
    );
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer/Admin)
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is job poster or admin
  if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this job`,
        401
      )
    );
  }

  await job.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get jobs within a radius
// @route   GET /api/jobs/radius/:zipcode/:distance
// @access  Private
exports.getJobsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const jobs = await Job.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs
  });
});

// @desc    Upload file for a job
// @route   POST /api/jobs/:id/upload
// @access  Private (Employer)
exports.uploadJobFile = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is job poster or admin
  if (job.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to upload files for this job`,
        401
      )
    );
  }

  if (!req.files || !req.files.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'text/csv',
    'text/plain'
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return next(new ErrorResponse('Invalid file type', 400));
  }

  // Check file size (limit to 5MB or use process.env.MAX_FILE_UPLOAD if set)
  const maxSize = process.env.MAX_FILE_UPLOAD || 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return next(new ErrorResponse(`Please upload a file less than ${maxSize} bytes`, 400));
  }

  // Create custom filename
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  file.name = `job_${job._id}_${Date.now()}${ext}`;

  // Save file to uploads directory
  const uploadPath = path.join(__dirname, '../public/uploads/', file.name);
  file.mv(uploadPath, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file upload', 500));
    }
    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});