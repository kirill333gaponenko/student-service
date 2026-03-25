import express from 'express';
import request from 'supertest';
import { jest, describe, it, beforeEach, expect } from '@jest/globals';

// Mock service layer to isolate web slice (controllers + routes)
const serviceMock = {
  addStudent: jest.fn(),
  findStudent: jest.fn(),
  deleteStudent: jest.fn(),
  updateStudent: jest.fn(),
  addScore: jest.fn(),
  findByName: jest.fn(),
  countByNames: jest.fn(),
  findByMinScore: jest.fn(),
};
await jest.unstable_mockModule('../service/studentService.js', () => serviceMock);

// Mock validators to control validation outcomes
const addStudentSchema = { validate: jest.fn().mockReturnValue({}) };
const updateStudentSchema = { validate: jest.fn().mockReturnValue({}) };
const ScoreSchema = { validate: jest.fn().mockReturnValue({}) };
await jest.unstable_mockModule('../validator/studentValidator.js', () => ({
  addStudentSchema,
  updateStudentSchema,
  ScoreSchema,
}));

// Import routes after mocks are set up so controllers see mocked modules
const studentRouter = (await import('../routes/studentRoutes.js')).default;

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(studentRouter);
  return app;
}

describe('studentController web slice', () => {
  let app;

  beforeEach(() => {
    app = buildApp();
    jest.clearAllMocks();
    // Reset validators to success by default
    addStudentSchema.validate.mockReturnValue({});
    updateStudentSchema.validate.mockReturnValue({});
    ScoreSchema.validate.mockReturnValue({});
  });

  // POST /student (addStudent)
  it('POST /student returns 204 when student is created successfully', async () => {
    serviceMock.addStudent.mockResolvedValueOnce(true);

    await request(app)
      .post('/student')
      .send({ any: 'data' })
      .expect(204);

    expect(serviceMock.addStudent).toHaveBeenCalledWith({ any: 'data' });
  });

  it('POST /student returns 400 on validation error', async () => {
    addStudentSchema.validate.mockReturnValueOnce({
      error: { details: [{ message: 'Invalid student payload' }] },
    });

    const res = await request(app)
      .post('/student')
      .send({})
      .expect(400);

    expect(res.text).toContain('Invalid student payload');
    expect(serviceMock.addStudent).not.toHaveBeenCalled();
  });

  it('POST /student returns 409 when student already exists (conflict)', async () => {
    serviceMock.addStudent.mockResolvedValueOnce(false);

    await request(app)
      .post('/student')
      .send({ name: 'Alice' })
      .expect(409);
  });

  // GET /student/:id (findStudent)
  it('GET /student/:id returns student when found', async () => {
    const student = { id: 123, name: 'Alice' };
    serviceMock.findStudent.mockResolvedValueOnce(student);

    const res = await request(app).get('/student/123').expect(200);

    expect(res.body).toEqual(student);
    expect(serviceMock.findStudent).toHaveBeenCalledWith(123); // coerced to number
  });

  it('GET /student/:id returns 404 when not found', async () => {
    serviceMock.findStudent.mockResolvedValueOnce(null);

    await request(app).get('/student/999').expect(404);
    expect(serviceMock.findStudent).toHaveBeenCalledWith(999);
  });

  // DELETE /student/:id (deleteStudent)
  it('DELETE /student/:id returns deleted student when successful', async () => {
    const deleted = { id: 5, name: 'Bob' };
    serviceMock.deleteStudent.mockResolvedValueOnce(deleted);

    const res = await request(app).delete('/student/5').expect(200);

    expect(res.body).toEqual(deleted);
    expect(serviceMock.deleteStudent).toHaveBeenCalledWith(5); // coerced to number
  });

  it('DELETE /student/:id returns 404 when not found', async () => {
    serviceMock.deleteStudent.mockResolvedValueOnce(undefined);

    await request(app).delete('/student/5').expect(404);
    expect(serviceMock.deleteStudent).toHaveBeenCalledWith(5);
  });

  // PATCH /student/:id (updateStudent)
  it('PATCH /student/:id updates and returns student when successful', async () => {
    const updated = { id: 7, name: 'New Name' };
    serviceMock.updateStudent.mockResolvedValueOnce(updated);

    const res = await request(app)
      .patch('/student/7')
      .send({ name: 'New Name' })
      .expect(200);

    expect(res.body).toEqual(updated);
    expect(serviceMock.updateStudent).toHaveBeenCalledWith(7, { name: 'New Name' }); // id coerced to number
  });

  it('PATCH /student/:id returns 400 on validation error', async () => {
    updateStudentSchema.validate.mockReturnValueOnce({
      error: { details: [{ message: 'Invalid update payload' }] },
    });

    await request(app).patch('/student/7').send({}).expect(400);
    expect(serviceMock.updateStudent).not.toHaveBeenCalled();
  });

  it('PATCH /student/:id returns 404 when student not found', async () => {
    serviceMock.updateStudent.mockResolvedValueOnce(null);

    await request(app)
      .patch('/student/8')
      .send({ name: 'X' })
      .expect(404);
  });

  // PATCH /score/student/:id (addScore)
  it('PATCH /score/student/:id returns 204 when score is added', async () => {
    serviceMock.addScore.mockResolvedValueOnce(true);

    await request(app)
      .patch('/score/student/10')
      .send({ examName: 'Math', score: '90' }) // score string should be coerced to number
      .expect(204);

    expect(serviceMock.addScore).toHaveBeenCalledWith(10, 'Math', 90); // id and score coerced
  });

  it('PATCH /score/student/:id returns 400 on score validation error', async () => {
    ScoreSchema.validate.mockReturnValueOnce({
      error: { details: [{ message: 'Invalid score payload' }] },
    });

    await request(app)
      .patch('/score/student/10')
      .send({})
      .expect(400);

    expect(serviceMock.addScore).not.toHaveBeenCalled();
  });

  it('PATCH /score/student/:id returns 404 when student not found', async () => {
    serviceMock.addScore.mockResolvedValueOnce(false);

    await request(app)
      .patch('/score/student/10')
      .send({ examName: 'Math', score: 90 })
      .expect(404);
  });

  // GET /students/name/:name (findByName)
  it('GET /students/name/:name returns matching students', async () => {
    const students = [{ id: 1, name: 'Ann' }];
    serviceMock.findByName.mockResolvedValueOnce(students);

    const res = await request(app).get('/students/name/Ann').expect(200);

    expect(res.body).toEqual(students);
    expect(serviceMock.findByName).toHaveBeenCalledWith('Ann');
  });

  // GET /quantity/students (countByNames)
  it('GET /quantity/students supports single and multiple names', async () => {
    serviceMock.countByNames.mockReturnValueOnce({ Ann: 1 });

    let res = await request(app)
      .get('/quantity/students')
      .query({ names: 'Ann' })
      .expect(200);

    expect(res.body).toEqual({ Ann: 1 });
    expect(serviceMock.countByNames).toHaveBeenCalledWith(['Ann']);

    jest.clearAllMocks();
    serviceMock.countByNames.mockReturnValueOnce({ Ann: 1, Bob: 2 });

    res = await request(app)
      .get('/quantity/students')
      .query({ names: ['Ann', 'Bob'] })
      .expect(200);

    expect(res.body).toEqual({ Ann: 1, Bob: 2 });
    expect(serviceMock.countByNames).toHaveBeenCalledWith(['Ann', 'Bob']);
  });

  // GET /students/exam/:exam/minscore/:minScore (findByMinScore)
  it('GET /students/exam/:exam/minscore/:minScore returns students by min score', async () => {
    const students = [{ id: 2, name: 'Carl' }];
    serviceMock.findByMinScore.mockResolvedValueOnce(students);

    const res = await request(app)
      .get('/students/exam/Math/minscore/80')
      .expect(200);

    expect(res.body).toEqual(students);
    expect(serviceMock.findByMinScore).toHaveBeenCalledWith('Math', 80);
  });
});