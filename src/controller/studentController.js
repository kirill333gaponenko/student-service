import * as repo from '../repository/studentRepository.js'

export const addStudent    = (req, res) => {

    const success = repo.addStudent(req.body);

    if (success) {
        res.status(204).send();
    }else{
        res.status(409).send();
    }
}

export const findStudent =(req, res) => {
    const student =repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    }else{
        res.status(404).send();
    }
}
export const deleteStudent =(req, res) => {
    const student =repo.deleteStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    }else{
        res.status(404).send();
    }
}
export const updateStudent =(req, res) => {
    const student =repo.updateStudent(+req.params.id,req.body);
    if (student) {
        const {score, ...studentWithoutScores} = student;
        res.json(studentWithoutScores);
    }else{
        res.status(404).send();
    }
}
export const addScore = (req, res) => {
    const success = repo.addScore(+req.params.id, req.body);
    if (success) {
        res.status(204).send();
    }else{
        res.status(404).send();
    }
}

export const findByName = (req, res) => {
    const students = repo.findByName(req.params.name);
    if (students) {
        const {score, ...studentWithoutScores} = students;
        res.json(studentWithoutScores);
    }else{
        res.status(404).send();
    }
}
export const countByNames = (req, res) => {
    const url =new URL(req.url, `http://localhost:8080`);
    const params = url.searchParams;
    const names = params.getAll("names")

    // const {names} = req.query;
    // const namesArr = names.split(",")
    console.log(names);
    const qun = repo.countByNames(names)
    if (qun) {
        res.send(qun);
    }else{
        res.status(404).send();
    }


}
export const findByMinScore = (req, res) => {

    const student =  repo.findByMinScore(req.params.exam,req.params.minScore);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    }else{
        res.status(404).send();
    }
}