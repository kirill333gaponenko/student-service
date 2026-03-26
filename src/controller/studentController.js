import * as service from '../service/studentService.js';
import {addStudentSchema, scoreSchema, updateStudentSchema} from "../validator/studentValidator.js";
import {AppError} from "../errors/AppError.js";
import {NotFoundError} from "../errors/NotFoundError.js";

export const addStudent = async (req, res) => {
    const {error} = addStudentSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    const success = await service.addStudent(req.body);
    if (!success) {
        throw new AppError("Student already exists", 409);
    }
    res.status(204).send();
}

export const findStudent = async (req, res) => {
    const student = await service.findStudent(+req.params.id);
    if (!student) {
        throw new NotFoundError(`Student ${req.params.id} not found`);
    }
    res.json(student);
}

export const deleteStudent = async (req, res) => {
    const student = await service.deleteStudent(+req.params.id);
    if (!student) {
        throw new NotFoundError(`Student ${req.params.id} not found`);
    }
    res.json(student);
}

export const updateStudent = async (req, res) => {
    const {error} = updateStudentSchema.validate(req.body);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }
    const student = await service.updateStudent(+req.params.id, req.body);
    if (!student) {
        throw new NotFoundError(`Student ${req.params.id} not found`);
    }
    res.json(student);
}

export const addScore = async (req, res) => {
    const {error} = scoreSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const success = await service.addScore(+req.params.id, req.body.examName, +req.body.score);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
}

export const findByName = async (req, res) => {
    const students = await service.findByName(req.params.name);
    res.json(students);
}

export const countByNames = async (req, res) => {
    const names = Array.isArray(req.query.names) ? req.query.names : [req.query.names];
    const count = await service.countByNames(names);
    res.json(count)
}

export const findByMinScore = async (req, res) => {
    const students = await service.findByMinScore(req.params.exam, +req.params.minScore);
    res.json(students);
}