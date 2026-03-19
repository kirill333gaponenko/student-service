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


    return renameIdOne(student);
}


export const deleteStudent = async (id) => {

    const student = await repo.findStudentById(id);
    if(student) {
        student.password = undefined;
       await repo.deleteStudentById(id);
       return renameIdOne(student);
    }

}

export const updateStudent = async (id, data) => {
    let student  = await repo.findStudentById(id);
    if(student) {
        await repo.updateStudent(id,data)
        student = await repo.findStudentById(id);
        student.password = undefined;
        return renameIdOne(student);
    }

}

export const addScore = async (id, exam, score) => {

    const student = await repo.findStudentById(id);
    if(student) {
        await repo.updateStudentScore(id,exam,score)
        return true;
    }
    return false;

}

export const findByName = async (name) => {


    const cursor =await repo.findStudentsByName(name);



    return renameID(cursor)

}

export const countByNames = async (names) => {

    return repo.countStudentsByName(names)

}

export const findByMinScore = async (exam, minScore) => {


    const cursor =await repo.findStudentsMinScore(exam,minScore)


    return renameID(cursor)

}

async function renameID(cursor){
    let students =[]

    for await (const s of cursor){
        s.password = undefined;
        s.id = s._id
        s._id = undefined;
        students.push(s)
    }
    return students
}
 function renameIdOne(student){

    if(student){
        student = {...student}
        student.password = undefined;
        student.id = student._id;
        student._id = undefined;
    }
    return  student;


}
