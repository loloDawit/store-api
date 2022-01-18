const express = require('express');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dbConnection = require('./config/db');
require('dotenv').config();
// Load routes
const auth = require('./routes/auth');

// DB connection
dbConnection();
const app = express();

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// DB protection:
app.use(mongoSanitize());

// Security features
app.use(helmet());

// More security and remove scripts
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);

// prevent hpp param pollution
app.use(hpp());
// Enable CORS
app.use(cors());

// logs HTTP responses
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Use static file and folders
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on Port ${PORT}`.yellow.bold);
});

// Handle all promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red.bold);
  // close server and exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
