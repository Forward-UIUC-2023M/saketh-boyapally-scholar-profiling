const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Profile = require("../models/Profile");

// @desc      Get all profiles
// @route     Get /api/profiles
// @access    Public
exports.getProfiles = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(req.query);

  // Create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in|eq)\b/g,
    (match) => `$${match}`
    // filter by sending "{{URL}}/api/v1/items?name='name'&const[lte]=number" or similar
  );

  // Finding resource
  query = Profile.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
    // select by sending "{{URL}}/api/v1/items?select=name,description,housing" or similar
    // to select and filter, "{{URL}}/api/v1/items?select=name,description,housing&housing=true" or similar
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createAt");
    //- give in decreasing order, positive give in increasing order
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1000;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Profile.countDocuments();

  query = query.skip(startIndex).limit(limit);
  // pagination and limit by sending "{{URL}}/api/v1/items?page=2&limit=2"

  // Executing query
  const profiles = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({ success: true, pagination, data: profiles });
});

// @desc    Get a single profile
// @route   GET /api/profiles/:id
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(
        `Profile not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: profile });
});

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
exports.createProfile = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for published profiles
  const publishedProfile = await Profile.findOne({ user: req.user.id });
  // can add only one profile
  if (publishedProfile) {
    return next(
      new ErrorResponse(
        `User with ID ${req.user.id} has already published a profile`,
        400
      )
    );
  }

  // Create profile
  const profile = await Profile.create(req.body);

  res.status(200).json({ success: true, data: profile });
});

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  console.log("updateProfile ID: ", req.params.id);
  let profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(
        `Profile not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  // Make sure user is item owner
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this item`,
        401
      )
    );
  }

  profile = await Profile.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: profile });
});

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  let profile = await Profile.findById(req.params.id);

  if (!profile) {
    return next(
      new ErrorResponse(
        `Profile not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  console.log(profile);

  // Make sure user is profile owner
  if (profile.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this item`,
        401
      )
    );
  }
  // await Profile.findById(req.params.id);
  profile.deleteOne({ _id: req.params.id });
  // profile.remove();

  res.status(200).json({ success: true, data: profile });
});
