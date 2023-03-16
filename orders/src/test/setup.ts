import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper.ts');

let mongo: MongoMemoryServer;

beforeAll(async () => {
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

global.signin = () => {
  // ============= FAKING signin method =============//
  // 1. Build a jwt payload { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // 2. Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // 3. Build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // 4. Turn that session into json string
  const sessionJSON = JSON.stringify(session);

  // 5. Take JSON and encode it as Base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // 6. Return a string, that's the cookie with encoded data
  return [`session=${base64}`];
};
