const pool = require('../config/db');

const selectAllHires = () => {
    return pool.query(`SELECT * FROM hire`);
}

const selectWorkerHires = (id_worker) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT recruiters.image as recruiter_image, hire.* from recruiters inner join hire on recruiters.id = hire.id_recruiter WHERE hire.id_worker='${id_worker}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const selectRecruiterHires = (id_recruiter) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT workers.name as worker_name, workers.email as worker_email, hire.* FROM hire inner join workers on hire.id_worker = workers.id WHERE hire.id_recruiter='${id_recruiter}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const selectHire = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM hire WHERE id='${id}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const insertHire = (data) => {
    const { id, id_worker, id_recruiter, reason, name, email, phone_number,
        description, read_status, created_at, updated_at } = data;
    return pool.query(`INSERT INTO hire VALUES('${id}', '${id_worker}', 
        '${id_recruiter}', '${reason}', '${name}', '${email}', '${phone_number}', 
        '${description}', '${read_status}', '${created_at}', '${updated_at}')`);
}

const updateHireReadStatus = (data) => {
    const { id, read_status } = data;
    return pool.query(`UPDATE hire SET read_status=${read_status} WHERE id='${id}'`);
}

const updateHire = (data) => {
    const { id, reason, name, email, phone_number,
        description, read_status, updated_at } = data;
    return pool.query(`UPDATE hire SET reason='${reason}', name='${name}', 
        email='${email}', phone_number='${phone_number}', 
        description='${description}', read_status='${read_status}',
        updated_at='${updated_at}' WHERE id='${id}'`);
}

const deleteHire = (id) => {
    return pool.query(`DELETE FROM hire WHERE id='${id}'`);
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT COUNT(id) FROM hire`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectAllHires,
    selectWorkerHires,
    selectRecruiterHires,
    selectHire,
    insertHire,
    updateHireReadStatus,
    updateHire,
    deleteHire,
    countData
}