const Menu = require('../models/MenuM');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors');

const getAllCourses = async (req, res) => {
  const coursesMenu = await Menu.find({}).sort('createdAt');
  res.status(StatusCodes.OK).json(coursesMenu);
};

const createCourse = async (req, res) => {
  const existingCourse = await Menu.findOne({ courseName: req.body.courseName }).exec();
  if (existingCourse) throw new ConflictError('Course already exist');

  const newCourse = await Menu.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Course: ${newCourse.courseName} created.`, course: newCourse });
};

const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { courseName, courseImg } = req.body;
  const updates = {};

  if (!courseName && !courseImg) throw new BadRequestError('Must provide some details');
  if (courseName && typeof courseName !== 'string')
    throw new BadRequestError('courseName must be a type of string');
  if (courseImg && typeof courseImg !== 'string')
    throw new BadRequestError('courseImg must be a type of string');

  if (courseName) updates.courseName = courseName;
  if (courseImg) updates.courseImg = courseImg;

  const query = { _id: courseId };
  const options = { new: true };
  const updatedCourse = await Menu.findOneAndUpdate(query, updates, options);
  if (!updatedCourse) throw new NotFoundError(`You don't have a course with the id: ${courseId}`);

  res
    .status(StatusCodes.OK)
    .json({ msg: `Course: ${updatedCourse.courseName} updated.`, course: updatedCourse });
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  const deletedCourse = await Menu.findOneAndDelete({ _id: courseId });
  if (!deletedCourse) throw new NotFoundError(`You don't have a course with the id: ${courseId}`);

  res.status(StatusCodes.OK).json({ msg: 'Deleted' });
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
