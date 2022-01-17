const mongoose = require('mongoose');

const connectDataBase = async () => {
  const connect = await mongoose.connect(process.env.MONGO_URI);
  console.log(`Mongo DB connected: ${connect.connection.host}`.blue.bold);
};

module.exports = connectDataBase;
