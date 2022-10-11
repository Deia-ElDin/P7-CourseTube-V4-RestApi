const mongoose = require('mongoose');

const InstructorSchema = mongoose.Schema({
  channelName: {
    type: String,
    required: [true, 'Must provide Channel Name'],
  },
  channelLink: {
    type: String,
    required: [true, 'Must provide Channel Link'],
  },
  channelLogo: {
    type: String,
    required: [true, 'Must provide Channel Logo'],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Instructor', InstructorSchema);
