import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  // Check if env variables are defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // Connect to the database
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.info('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  // The port wouldn't matter when we start kubernetes
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!');
  });
};

start();
