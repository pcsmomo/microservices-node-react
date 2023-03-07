import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// declare global to make typescript aware of the global variable
declare global {
  var signin: (id?: string) => string[];
  var generateId: () => string;
  var MOCK_CHARGE_ID: string;
}

global.console = {
  ...console,
  // uncomment to ignore a specific log level
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// __mocks__ folder is a special folder for jest
// and it will automatically look for a file with the same name
// as the module that we are trying to mock out.
jest.mock('../nats-wrapper.ts');

// use this key if you want to use real stripe api
// process.env.STRIPE_KEY = '<read secret key>';

let mongo: any;
beforeAll(async () => {
  // environment variables (not the best way to do it though)
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  // clear all mocks before each test
  jest.clearAllMocks();

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
global.signin = (id?: string) => {
  // Build a JWT payload. { id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
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

global.generateId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};

// mock stripe charge id
global.MOCK_CHARGE_ID = 'mock_charge_id';
