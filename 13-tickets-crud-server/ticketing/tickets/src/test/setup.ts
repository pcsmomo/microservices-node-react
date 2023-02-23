import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

// declare global to make typescript aware of the global variable
declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
beforeAll(async () => {
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
global.signin = async () => {
  // Build a JWT payload. { id, email}
  // Create the JWT!
  // Build session Object. { jwt: MY_JWT }
  // Turn that session into JSON
  // Take JSON and encode it as base64
  // return a string that's the cookie with the encoded data
};

// global.getCookieAfterSignup = async () => {
//   const email = 'test@test.com';
//   const password = 'password';

//   const response = await request(app)
//     .post('/api/users/signup')
//     .send({
//       email,
//       password,
//     })
//     .expect(201);

//   const cookie = response.get('Set-Cookie');

//   return cookie;
// };
