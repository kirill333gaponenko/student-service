// The Arrange Act Assert (AAA) pattern in TDD unit testing


import {beforeEach, describe, expect, jest, test} from '@jest/globals';


// Mock repository module BEFORE importing the service
await jest.unstable_mockModule('../repository/studentRepository.js', () => ({
  createStudent: jest.fn(),
  findStudentById: jest.fn(),
  deleteStudentById: jest.fn(),
  updateStudent: jest.fn(),
  updateStudentScore: jest.fn(),
  findStudentsByName: jest.fn(),
  countStudentsByName: jest.fn(),
  findStudentsMinScore: jest.fn()
}));

// Import mocked repository and then the service under test
const repo = await import('../repository/studentRepository.js');
const service = await import('../service/studentService.js');

describe('studentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('addStudent creates a new student when id does not exist', async () => {
    repo.findStudentById.mockResolvedValue(null);
    repo.createStudent.mockResolvedValue({ _id: '1', name: 'Alice' }); // cant understand why we need it ???

    const result = await service.addStudent({ id: '1', name: 'Alice', password: 'secret' });

    expect(repo.findStudentById).toHaveBeenCalledWith('1');
    expect(repo.createStudent).toHaveBeenCalledWith({ _id: '1', name: 'Alice', password: 'secret' });
    expect(result).toBe(true);
  });

  test('addStudent returns false when student with id already exists', async () => {
    repo.findStudentById.mockResolvedValue({ _id: '1', name: 'Existing' });

    const result = await service.addStudent({ id: '1', name: 'Alice', password: 'secret' });

    expect(repo.findStudentById).toHaveBeenCalledWith('1');
    expect(repo.createStudent).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('findStudent returns repository result', async () => {
    const student = { _id: '2', name: 'Bob' };
    repo.findStudentById.mockResolvedValue(student);

    const result = await service.findStudent('2');

    expect(repo.findStudentById).toHaveBeenCalledWith('2');
    expect(result).toBe(student);
  });

  test('deleteStudent proxies to repository', async () => {
    const delRes = { _id: '3' };
    repo.deleteStudentById.mockResolvedValue(delRes);

    const result = await service.deleteStudent('3');

    expect(repo.deleteStudentById).toHaveBeenCalledWith('3');
    expect(result).toBe(delRes);
  });

  test('updateStudent removes scores from returned object', async () => {
    const updated = { _id: '4', name: 'Charlie', scores: { math: 90, physics: 85 } };
    repo.updateStudent.mockResolvedValue({
      toObject: () => ({ ...updated })
    });

    const result = await service.updateStudent('4', { name: 'Charlie' });

    expect(repo.updateStudent).toHaveBeenCalledWith('4', { name: 'Charlie' });
    expect(result).toEqual({ _id: '4', name: 'Charlie', scores: undefined });
  });

  test('addScore proxies to repository', async () => {
    const res = { acknowledged: true };
    repo.updateStudentScore.mockResolvedValue(res);

    const result = await service.addScore('5', 'math', 95);

    expect(repo.updateStudentScore).toHaveBeenCalledWith('5', 'math', 95);
    expect(result).toBe(res);
  });

  test('findByName proxies to repository', async () => {
    const list = [{ _id: '6', name: 'Dana' }];
    repo.findStudentsByName.mockResolvedValue(list);

    const result = await service.findByName('Dana');

    expect(repo.findStudentsByName).toHaveBeenCalledWith('Dana');
    expect(result).toBe(list);
  });

  test('countByNames proxies to repository (sync)', () => {
    repo.countStudentsByName.mockReturnValue(7);

    const result = service.countByNames(['Eve', 'Frank']);

    expect(repo.countStudentsByName).toHaveBeenCalledWith(['Eve', 'Frank']);
    expect(result).toBe(7);
  });

  test('findByMinScore proxies to repository', async () => {
    const list = [{ _id: '7', name: 'Gina' }];
    repo.findStudentsMinScore.mockResolvedValue(list);

    const result = await service.findByMinScore('math', 80);

    expect(repo.findStudentsMinScore).toHaveBeenCalledWith('math', 80);
    expect(result).toBe(list);
  });
});