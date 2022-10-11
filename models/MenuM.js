const mongoose = require('mongoose');

const MenuSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'Must provide Course Name'],
    },
    courseImg: {
      type: String,
      required: [true, 'Must provide Course Image'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Menu', MenuSchema);
