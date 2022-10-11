const Course = require('../models/CourseM');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors');

const getAllCourses = async (req, res) => {
  const courses = await Course.find({}).sort('channelName');
  res.status(StatusCodes.OK).json(courses);
};

const createCourse = async (req, res) => {
  const existingCourse = await Course.findOne(req.body).exec();
  if (existingCourse) throw new ConflictError('Course already exist');

  const newCourse = await Course.create(req.body);
  res.status(StatusCodes.CREATED).json({
    msg: `Course: ${newCourse.courseTitle.substring(0, 10)}... created.`,
    course: newCourse,
  });
};

const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const {
    channelName,
    searchKeywords,
    courseImg,
    courseLink,
    courseTitle,
    courseDuration,
    views,
    createdAt,
  } = req.body;
  const updates = {};

  if (
    !channelName &&
    !searchKeywords &&
    !courseImg &&
    !courseLink &&
    !courseTitle &&
    !courseDuration &&
    !views &&
    !createdAt
  )
    throw new BadRequestError('Must provide some details');
  if (channelName && typeof channelName !== 'string')
    throw new BadRequestError('channelName must be a type of string');
  if (searchKeywords && typeof searchKeywords !== 'string')
    throw new BadRequestError('searchKeywords must be a type of string');
  if (courseImg && typeof courseImg !== 'string')
    throw new BadRequestError('courseImg must be a type of string');
  if (courseLink && typeof courseLink !== 'string')
    throw new BadRequestError('courseLink must be a type of string');
  if (courseTitle && typeof courseTitle !== 'string')
    throw new BadRequestError('courseTitle must be a type of string');
  if (courseDuration && typeof courseDuration !== 'string')
    throw new BadRequestError('courseDuration must be a type of string');
  if (views && typeof views !== 'string')
    throw new BadRequestError('views must be a type of string');
  if (createdAt && typeof createdAt !== 'string')
    throw new BadRequestError('createdAt must be a type of string');

  if (channelName) updates.channelName = channelName;
  if (searchKeywords) updates.searchKeywords = searchKeywords;
  if (courseImg) updates.courseImg = courseImg;
  if (courseLink) updates.courseLink = courseLink;
  if (courseTitle) updates.courseTitle = courseTitle;
  if (courseDuration) updates.courseDuration = courseDuration;
  if (views) updates.views = views;
  if (createdAt) updates.createdAt = createdAt;

  const query = { _id: courseId };
  const options = { new: true, runValidators: true };
  const updatedCourse = await Course.findOneAndUpdate(query, updates, options);
  if (!updatedCourse) throw new NotFoundError(`You don't have an course with the id: ${courseId}`);

  res.status(StatusCodes.OK).json({
    msg: `Course: ${updatedCourse.courseTitle.substring(0, 10)}... updated.`,
    course: updatedCourse,
  });
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  const deletedCourse = await Course.findOneAndDelete({ _id: courseId });
  if (!deletedCourse) throw new NotFoundError(`You don't have a course with the id: ${courseId}`);

  res.status(StatusCodes.OK).json({ msg: 'Deleted' });
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
