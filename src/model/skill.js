const pool = require('../config/db');

const selectAllSkills = () => {
    return pool.query(`SELECT worker_skills.*, skills.name FROM worker_skills 
        INNER JOIN skills ON skills.id = worker_skills.id_skill`);
}

const selectWorkerSkills = (id_worker) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT worker_skills.id, skills.name FROM worker_skills 
            INNER JOIN skills ON skills.id = worker_skills.id_skill 
            WHERE worker_skills.id_worker='${id_worker}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const selectWorkerSkill = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT worker_skills.id, skills.name FROM worker_skills 
            INNER JOIN skills ON skills.id = worker_skills.id_skill 
            WHERE worker_skills.id='${id}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const selectWorkerSkillName = (id_worker, name) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT worker_skills.id, skills.name FROM worker_skills 
            INNER JOIN skills ON skills.id = worker_skills.id_skill 
            WHERE worker_skills.id_worker='${id_worker}' and skills.name='${name}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const selectSkillName = (name) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM skills where name='${name}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const insertSkill = (data) => {
    const { id, name } = data;
    return pool.query(`INSERT INTO skills VALUES('${id}', '${name}')`);
}

const insertWorkerSkill = (data) => {
    const { id, id_worker, id_skill } = data;
    return pool.query(`INSERT INTO worker_skills VALUES('${id}', '${id_worker}', '${id_skill}')`);
}

const deleteWorkerSkill = (id) => {
    return pool.query(`DELETE FROM worker_skills WHERE id='${id}'`);
}

const countWorkerSkills = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(id) from worker_skills`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectAllSkills,
    selectWorkerSkills,
    selectSkillName,
    selectWorkerSkill,
    selectWorkerSkillName,
    insertSkill,
    insertWorkerSkill,
    deleteWorkerSkill,
    countWorkerSkills
}