const mongoose = require('mongoose');
require('dotenv').config();

let connection;
const connectDataBase = async () => {
  try {
    connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo DB connected: ${connection.connection.host}`.blue.bold);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const disconnectDataBase = async () => {
  try {
    console.log(`Clossing Mongo DB connection: ${mongoose.connection.host}`.yellow.bold);
    await mongoose.connection.close();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDataBase, disconnectDataBase };
