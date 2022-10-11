const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer')) throw new UnauthorizedError('Authentication Invalid');

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = payload.username;
    req.role = payload.role;
    next();
  } catch (err) {
    throw new ForbiddenError("You don't have permission to access this source");
  }
};

module.exports = verifyToken;
