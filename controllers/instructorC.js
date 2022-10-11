const Instructor = require('../models/InstructorM');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, ConflictError, NotFoundError } = require('../errors');

const getAllInstructors = async (req, res) => {
  const InstructorsChannels = await Instructor.find({}).sort('channelName');
  res.status(StatusCodes.OK).json(InstructorsChannels);
};

const createInstructor = async (req, res) => {
  const existingInstructor = await Instructor.findOne({ channelName: req.body.channelName }).exec();
  if (existingInstructor) throw new ConflictError('Instructor already exist');

  const newInstructor = await Instructor.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Instructor: ${newInstructor.channelName} created.`, instructor: newInstructor });
};

const updateInstructor = async (req, res) => {
  const instructorId = req.params.id;
  const { channelName, channelLink, channelLogo, verified } = req.body;
  const updates = {};

  if (channelName && typeof channelName !== 'string')
    throw new BadRequestError('channelName must be a type of string');
  if (channelLink && typeof channelLink !== 'string')
    throw new BadRequestError('channelLink must be a type of string');
  if (channelLogo && typeof channelLogo !== 'string')
    throw new BadRequestError('channelLogo must be a type of string');
  if (verified && typeof verified !== 'boolean')
    throw new BadRequestError('verified must be a type of boolean');

  if (channelName) updates.channelName = channelName;
  if (channelLink) updates.channelLink = channelLink;
  if (channelLogo) updates.channelLogo = channelLogo;
  if (`${verified}`) updates.verified = verified;

  const query = { _id: instructorId };
  const options = { new: true };
  const updatedInstructor = await Instructor.findOneAndUpdate(query, updates, options);
  if (!updatedInstructor)
    throw new NotFoundError(`You don't have an instructor with the id: ${instructorId}`);

  res.status(StatusCodes.OK).json({
    msg: `Instructor: ${updatedInstructor.channelName} updated.`,
    instructor: updatedInstructor,
  });
};

const deleteInstructor = async (req, res) => {
  const instructorId = req.params.id;

  const deletedInstructor = await Instructor.findOneAndDelete({ _id: instructorId });
  if (!deletedInstructor)
    throw new NotFoundError(`You don't have an instructor with the id: ${instructorId}`);

  res.status(StatusCodes.OK).json({ msg: 'Deleted' });
};

module.exports = {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
};
