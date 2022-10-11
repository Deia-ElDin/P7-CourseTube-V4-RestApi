const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
  channelName: {
    type: String,
    required: [true, 'Must provide Channel Name'],
  },
  searchKeywords: {
    type: String,
    required: [true, 'Must provide Course Name'],
  },
  courseImg: {
    type: String,
    required: [true, 'Must provide Course Image'],
  },
  courseLink: {
    type: String,
    required: [true, 'Must provide Course Link'],
  },
  courseTitle: {
    type: String,
    required: [true, 'Must provide Course Title'],
  },
  courseDuration: {
    type: String,
    required: [true, 'Must provide Course Duration'],
  },
  views: {
    type: String,
    required: [true, 'Must provide the Views'],
  },
  createdAt: String,
});

module.exports = mongoose.model('Course', CourseSchema);
