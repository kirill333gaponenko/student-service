import {Student} from "../model/student.js";

const students = new Map();





export const addStudent = ({id,name,password})=>{

    if(students.has(id)) {
        return false;
    }

    students.set(id,new Student(id,name,password));
    return true;

}


export const findStudent = (id) =>students.get(id);


export const deleteStudent = (id) =>{

    const student = students.get(id);
    if (student) {
        students.delete(id);
        return student;
    }
}

export const updateStudent = (id, data) =>{
    const student = students.get(id);
    if (student) {
        // students.set(id, {...student, ...data});
        // return students.get(id);
        Object.assign(student, data);
        return student;
    }

}

export const addScore = (id, exam,score) =>{

    const student =students.get(id);
    if (student) {
        student.score[exam] = score;

        return true;
    }
    return false;

}
export const findByName = (name) =>{

    return Array.from(students.values()).filter(student => student.name.toLowerCase() === name.toLowerCase());

}
export const countByNames    = (names) =>{

    names = names.map(name =>name.toLowerCase());
    return Array.from(students.values()).filter(student => names.includes(student.name.toLowerCase())).length;

}
export const findByMinScore    = (exam, minScore) =>{
    const studentByMinScore =[]
    for(const [id,student] of students) {
        const studentExams = (student.score)
        for(const studentExam of studentExams){
            if(exam === studentExam.examName && minScore < studentExam.score){
                studentByMinScore.push(student);
            }
        }
    }
    if(studentByMinScore.length!==0){
        return studentByMinScore;
    }

}