import * as repo from  "../repository/studentRepository.js"



export const addStudent = async ({id, name, password}) => {
    if(await repo.findStudentById(id)) {
        return false;
    }
    await repo.createStudent({_id: id, name, password});
    return true;
}

export const findStudent = async (id) =>{

    const student = await repo.findStudentById(id);

    return student
}


export const deleteStudent = async (id) => await repo.deleteStudentById(id)

export const updateStudent = async (id, data) => {
    const student = (await repo.updateStudent(id, data))?.toObject(); //convert a document to a regular js object, but if there is not obj fun toObject() don't work
    if(student) {
        student.scores = undefined;
    }
    return student;

}

export const addScore = async (id, exam, score) => await repo.updateStudentScore(id, exam, score);

export const findByName = async (name) => await repo.findStudentsByName(name)



export const countByNames = (names) => repo.countStudentsByName(names)

export const findByMinScore = async (exam, minScore) => await repo.findStudentsMinScore(exam, minScore);


function renameId(student){
    if(student){
        student.id =student._id;
        delete student._id
    }
    return student;
}
