
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

import studentRoutes from '../routes/studentRoutes.js';
import Student from '../model/student.js';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', studentRoutes);
  return app;
}

let app;

beforeAll(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/students_service_test';
  const dbName = process.env.MONGO_DB_NAME || 'students_service_test';
  await mongoose.connect(uri, { dbName });
  app = buildApp();
});

beforeEach(async () => {
  await Student.deleteMany({});
});

afterAll(async () => {
  // Best-effort cleanup; ignore errors if DB was already dropped
  try {
    await mongoose.connection.dropDatabase();
  } catch (_) {}
  await mongoose.disconnect();
});

describe('studentController integration', () => {
  it('POST /api/student creates a student (204) and GET returns it with correct body', async () => {
    const payload = { id: 1001, name: 'Alice', password: '12345' }; // password is string; Mongoose casts to Number

    const postRes = await request(app)
      .post('/api/student')
      .send(payload);

    expect(postRes.status).toBe(204);

    const saved = await Student.findById(payload.id).lean().exec();
    expect(saved).toBeTruthy();
    expect(saved.name).toBe(payload.name);
    expect(saved.password).toBe(Number(payload.password)); // ensure stored in DB

    const getRes = await request(app).get(`/api/student/${payload.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toMatchObject({
      id: payload.id,
      name: payload.name
    });
    expect(getRes.body).not.toHaveProperty('password'); // password should be omitted in JSON
  });
});