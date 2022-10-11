const User = require('../models/UsersM');
const { StatusCodes } = require('http-status-codes');

const logout = async (req, res) => {
  const cookie = req.cookies;

  if (!cookie?.jwt) return res.sendStatus(StatusCodes.NO_CONTENT);

  const refreshToken = cookie.jwt;

  const loggedOutUser = await User.findOne({ token: refreshToken }).exec();
  if (!loggedOutUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(StatusCodes.FORBIDDEN);
  }

  loggedOutUser.token = '';
  await loggedOutUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(StatusCodes.NO_CONTENT);
};

module.exports = logout;
