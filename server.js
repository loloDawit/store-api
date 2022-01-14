const express = require('express');
require('dotenv').config();

const app = express();

app.use('/api/v1/', (req, res) => {
  res.send({ message: 'Hi' });
});

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on Port ${PORT}`);
});
