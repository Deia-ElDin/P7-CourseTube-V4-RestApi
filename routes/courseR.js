const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseC');
const ROLES_LIST = require('../config/rolesList');
const verifyRole = require('../middleware/authorization');

router
  .route('/')
  .get(verifyRole(ROLES_LIST.Admin, ROLES_LIST.User), getAllCourses)
  .post(verifyRole(ROLES_LIST.Admin), createCourse);

router
  .route('/:id')
  .patch(verifyRole(ROLES_LIST.Admin), updateCourse)
  .delete(verifyRole(ROLES_LIST.Admin), deleteCourse);

module.exports = router;
