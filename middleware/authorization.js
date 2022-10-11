const { UnauthorizedError } = require('../errors');

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.role) throw new UnauthorizedError('Authentication Invalid');

    const rolesArray = [...allowedRoles];

    const result = rolesArray.includes(req.role) ? true : false;
    if (!result) throw new UnauthorizedError('Not authorized to access this route');
    next();
  };
};

module.exports = verifyRole;
