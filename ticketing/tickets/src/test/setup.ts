import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// declare global to make typescript aware of the global variable
declare global {
  var signin: () => string[];
}

// __mocks__ folder is a special folder for jest
// and it will automatically look for a file with the same name
// as the module that we are trying to mock out.
jest.mock('../nats-wrapper.ts');

let mongo: any;
beforeAll(async () => {
  jest.clearAllMocks();

  // environment variables (not the best way to do it though)
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

// this doesn't have to be defined here. (it's just an option)
// It can be defined somewhere else and imported in test files.
global.signin = () => {
  // Build a JWT payload. { id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that's the cookie with the encoded data
  // supertest takes this in array
  return [`session=${base64}`];
};
