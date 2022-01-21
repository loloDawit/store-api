const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
require('colors');
// Load routes
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// DB protection:
app.use(mongoSanitize());

// **** Security features ***
// by setting HTTP headers appropriately, protects us from well-known web vulnerabilities
app.use(helmet());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      maxAge: 60 * 60 * 24 * 7 * 1000, // 1 week
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000)
    }
  })
);

// Cross-site scripting (XSS): to prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // Limit each IP to 100 requests per `window` , per 10 minutes)
  standardHeaders: true // Return rate limit info in the `RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
if (process.env.NODE_ENV === 'production' && app.use(limiter));

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

module.exports = app;
