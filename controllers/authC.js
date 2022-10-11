const User = require('../models/UsersM');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
} = require('../errors');

const register = async (req, res) => {
  // This function only made to create 2 accounts (Admin account & User account)
  if (!req?.body?.username || !req?.body?.password)
    throw new BadRequestError('Please provide username and password');

  const { username, password, role } = req.body;

  const duplicate = await User.findOne({ username });
  if (duplicate)
    throw new ConflictError(
      `Username: ${username} already exist, please choose another username`
    );

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    password: hashedPassword,
    role,
  });

  res.status(StatusCodes.CREATED).json({ username: newUser.username });
};

const login = async (req, res) => {
  if (!req?.body?.username || !req?.body?.password)
    throw new BadRequestError('Please provide a username and password');

  const { username, password } = req.body;

  const loggedUser = await User.findOne({ username }).exec();
  if (!loggedUser) throw new UnauthorizedError('Invalid Credentials');

  const isPasswordCorrect = await loggedUser.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthorizedError('Invalid Credentials');

  const accessToken = loggedUser.createAccessToken();
  const refreshToken = loggedUser.createRefreshToken();

  loggedUser.token = refreshToken;
  await loggedUser.save();

  const cookieOptions = {
    httpOnly: true,
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000,
    // secure: true,
  };

  res.cookie('jwt', refreshToken, cookieOptions);
  res.status(StatusCodes.OK).json({ user: loggedUser.username, accessToken });
};

const handleToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) throw new UnauthorizedError('Invalid Credentials');

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ token: refreshToken }).exec();
  if (!foundUser)
    throw new ForbiddenError("You don't have permission to access this source");

  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = foundUser.createAccessToken();
    res.status(StatusCodes.OK).json({ user: foundUser.username, accessToken });
  } catch (err) {
    throw new ForbiddenError("You don't have permission to access this source");
  }
};

module.exports = { register, login, handleToken };
