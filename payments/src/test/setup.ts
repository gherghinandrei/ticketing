import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';


declare global {
  var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');
process.env.STRIPE_KEY = "sk_test_51NCpgNGFQJHQDO5MjLqAr0T6zArDzOV2m2Aq39b0axynagjui0EcMAtZzSmqSGPqlIDCqJi1MnELL5Oyt9hj2huy00AHuLuyec";

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asddsa';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});


beforeEach(async () => {
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

global.signin = (id?: string) => {
  // build a JWT payload { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // Build the session object {jwt: MY_JWT }
  const session = { jwt: token };
  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return a string thats a cookie with the encoded data

  return [`session=${base64}`];


}