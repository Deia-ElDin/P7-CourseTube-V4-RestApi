const CustomAPIError = require('./customError');
const BadRequestError = require('./badRequest');
const UnauthorizedError = require('./unauthorized');
const ConflictError = require('./conflict');
const NotFoundError = require('./notFound');
const ForbiddenError = require('./forbidden');

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
};
