const express = require('express');
const router = express.Router();
const {
  getAllInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} = require('../controllers/instructorC');
const ROLES_LIST = require('../config/rolesList');
const verifyRole = require('../middleware/authorization');

router
  .route('/')
  .get(verifyRole(ROLES_LIST.Admin, ROLES_LIST.User), getAllInstructors)
  .post(verifyRole(ROLES_LIST.Admin), createInstructor);

router
  .route('/:id')
  .patch(verifyRole(ROLES_LIST.Admin), updateInstructor)
  .delete(verifyRole(ROLES_LIST.Admin), deleteInstructor);

module.exports = router;
