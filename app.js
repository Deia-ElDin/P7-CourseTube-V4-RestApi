require('dotenv').config();
require('express-async-errors');
// App
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
// Security
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const corsOptions = require('./config/corsOptions');
// Cookie
const cookieParser = require('cookie-parser');
// DateBase
const connectDB = require('./db/connectDB');
// Middleware
const logger = require('./middleware/logger');
const credentials = require('./middleware/credentials');
const verifyToken = require('./middleware/authentication');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
// Routes
const authRouter = require('./routes/authR');
const menuRouter = require('./routes/menuR');
const instructorsRouter = require('./routes/instructorR');
const coursesRouter = require('./routes/courseR');
const logoutRouter = require('./routes/logoutR');

app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());
app.use(xss());

app.use('/auth', authRouter);
app.use('/api/v1/menu', verifyToken, menuRouter);
app.use('/api/v1/instructors', verifyToken, instructorsRouter);
app.use('/api/v1/courses', verifyToken, coursesRouter);
app.use('/logout', logoutRouter);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT);
  } catch (err) {
    console.log(err);
  }
};

start();
