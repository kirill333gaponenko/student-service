import * as repo from  "../repository/studentRepository.js"
import {deleteStudentById} from "../repository/studentRepository.js";



export const addStudent = async ({id, name, password}) => {
    if(await repo.findStudentById(id)) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) =>{

    const student = await repo.findStudentById(id);
    if(student) {
        student.password = undefined;
    }
    return renameId(student);
}


export const deleteStudent = async (id) => {
    const  student = await repo.deleteStudentById(id);
    if(student) {
        student.password = undefined

    }
    return renameId(student);

}

export const updateStudent = async (id, data) => {
    //TODO

}

export const addScore = async (id, exam, score) => {
    //TODO

}

export const findByName = (name) => {
    //TODO
}

export const countByNames = (names) => {
    //TODO

}

export const findByMinScore = async (exam, minScore) => {
    //TODO

}

function renameId(student){
    if(student){
        student.id =student._id;
        delete student._id
    }
    return student;
}
