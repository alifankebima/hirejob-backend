const pool = require('../config/db');

const selectAllWorkers = (filter, searchQuery, sortBy, sort, limit, offset) => {
    return pool.query(`SELECT * FROM workers
        WHERE ${filter} ILIKE '%${searchQuery}%' 
        ORDER BY ${sortBy} ${sort} LIMIT ${limit} OFFSET ${offset}`);
}

const selectWorker = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM workers WHERE id='${id}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const insertWorker = (data) => {
    const { id, name, email, phone_number, password } = data;
    return pool.query(`INSERT INTO workers VALUES('${id}', '${name}', 
        '${email}', '${phone_number}', '${password}')`);
}

const updateWorker = (data) => {
    const { id, name, email, phone_number, password, image, jobdesk, residence,
        workplace, description, job_type, instagram, github, gitlab } = data;
    return pool.query(`UPDATE workers SET name='${name}', email='${email}', 
        phone_number='${phone_number}', password='${password}', image='${image}', 
        jobdesk='${jobdesk}', residence='${residence}', workplace='${workplace}', 
        description='${description}', job_type='${job_type}', 
        instagram='${instagram}', github='${github}', gitlab='${gitlab}' 
        WHERE id='${id}'`);
}

const deleteWorker = (id) => {
    return pool.query(`DELETE FROM workers WHERE id='${id}'`);
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(id) from workers`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const findEmail = (email) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM workers WHERE email='${email}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectAllWorkers,
    selectWorker,
    insertWorker,
    updateWorker,
    deleteWorker,
    countData,
    findEmail
}