import Student from "../model/student.js";

export function createStudent(student) {
     return Student.create(student);
}

export function findStudentById(id) {
    return Student.findById(id).lean();
}

export function deleteStudentById(id) {
    return Student.findByIdAndDelete(id);
}


//exists()
//updateOne()
//insertMany()
//deleteMany()


export function updateStudent(id, data){
    return Student.findByIdAndUpdate(id, data);
}

export function updateStudentScore(id, exam, score){
    return Student.findByIdAndUpdate(id, {$set: {[`scores.${exam}`]: score}});
}

export function findStudentsByName(name) {
    return Student.find({name: new RegExp(`^${name}$`, 'i')}).lean();
}

export function countStudentsByName(names) {
    const regexConditions = names.map(name => ({
        name: new RegExp(`^${name}$`, 'i')
    }));
    return Student.countDocuments({$or: regexConditions});
}

export function findStudentsMinScore(exam, minScore) {
    return Student.find({[`scores.${exam}`]: {$gte: minScore}}).lean();
}