const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDataBase = async () => {
  try {
    let dbUri = process.env.MONGO_URI;
    if (process.env.NODE_ENV === 'test') {
      mongod = await MongoMemoryServer.create();
      dbUri = mongod.getUri();
    }
    const connect = await mongoose.connect(dbUri);
    console.log(`Mongo DB connected: ${connect.connection.host}`.blue.bold);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const disconnectDataBase = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDataBase, disconnectDataBase };
