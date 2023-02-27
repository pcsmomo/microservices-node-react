import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  // Check if env variables are defined
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  // Connect to other services
  try {
    // 'ticketing', clusterID is defined in nats-depl.yaml
    await natsWrapper.connect('ticketing', 'asdfasdf', 'http://nats-srv:4222');

    await mongoose.connect(process.env.MONGO_URI);
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
