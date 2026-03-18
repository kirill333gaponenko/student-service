import * as repo from  "../repository/studentRepository.js"




export const addStudent = async ({id, name, password}) => {
    if(await repo.findStudentById(id)) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) =>{

    let student = await repo.findStudentById(id);
    console.log(student)
    if(student) {
        student.password = undefined;
    }
    return student;
}


export const deleteStudent = async (id) => {
    //TODO

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

    //TODO

}