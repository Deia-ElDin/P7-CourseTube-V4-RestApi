const logEvents = require('./logEvents');
const { StatusCodes } = require('http-status-codes');

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err: err.message || 'Something went wrong, please try again later',
  };

  if (err.name === 'ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.err = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  res.status(customError.statusCode).json(customError.err);
};

module.exports = errorHandler;
