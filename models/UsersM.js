const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Must provide Username'],
    trim: true,
    maxlength: [20, 'username must be less than 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'Must provide Password'],
    minLength: [3, 'password must not be less than 3 characters'],
  },
  role: {
    type: String,
    default: 'User',
  },
  token: {
    type: String,
    default: '',
  },
});

UserSchema.methods.createAccessToken = function () {
  const payload = { userId: this._id, username: this.username, role: this.role };
  const jwtPw = process.env.ACCESS_TOKEN_SECRET;
  const jwtExpiresIn = { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRES };

  const accessToken = jwt.sign(payload, jwtPw, jwtExpiresIn);
  return accessToken;
};

UserSchema.methods.createRefreshToken = function () {
  const payload = { userId: this._id, username: this.username, role: this.role };
  const jwtPw = process.env.REFRESH_TOKEN_SECRET;
  const jwtExpiresIn = { expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRES };

  const refreshToken = jwt.sign(payload, jwtPw, jwtExpiresIn);
  return refreshToken;
};

UserSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
