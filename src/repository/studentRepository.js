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

export const addScore = (id, exam) =>{

    const student =students.get(id);
    if (student) {
        students.set(id,{...student, score: [...student.score,exam]});
        console.log(students);
        return true;
    }
    return false;

}
export const findByName = (name) =>{
    const studentByName =[]
    for(const [id,student] of students) {
        if(name === student.name) {
            studentByName.push(student);
        }
    }
    if(studentByName.length!==0){
        return studentByName;
    }


}
export const countByNames    = (names) =>{

    let count = 0;
    for(const [id,student] of students) {
        for(const name of names) {
            if(name === student.name) {
                count++;
            }
        }
    }
    return count;

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