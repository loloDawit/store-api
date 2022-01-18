const express = require('express');
const colors = require('colors');
require('dotenv').config();
const dbConnection = require('./config/db');
// Load routes
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');

// DB connection
dbConnection();
const app = express();
// parse the body
app.use(express.json());
// parse the cookier
app.use(cookieParser());

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
  logger.error(`Error: ${err.message}`.red.bold);
  // close server and exit process
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
