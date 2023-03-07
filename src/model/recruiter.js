const pool = require('../config/db');

const selectAllRecruiters = () => {
    return pool.query(`SELECT * FROM recruiters`);
}

const selectRecruiter = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM recruiters WHERE id='${id}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const insertRecruiter = (data) => {
    const { id, name, email, company_name, jobdesk, phone_number, password } = data;
    return pool.query(`INSERT INTO recruiters VALUES('${id}', '${name}', 
        '${email}', '${company_name}', '${jobdesk}', '${phone_number}', 
        '${password}')`);
}

const updateRecruiter = (data) => {
    const { id, name, email, company_name, jobdesk, phone_number, password, image,
        company_field, workplace, description, instagram, linkedin, 
        banner_image } = data;
    return pool.query(`UPDATE recruiters SET name='${name}', email='${email}', 
        company_name='${company_name}', jobdesk='${jobdesk}', 
        phone_number='${phone_number}', password='${password}', image='${image}', 
        company_field='${company_field}', workplace='${workplace}', 
        description='${description}', instagram='${instagram}', 
        linkedin='${linkedin}', banner_image='${banner_image}' WHERE id='${id}'`);
}

const deleteRecruiter = (id) => {
    return pool.query(`DELETE FROM recruiters WHERE id='${id}'`);
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(id) from recruiters`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const findEmail = (email) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM recruiters WHERE email='${email}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectAllRecruiters,
    selectRecruiter,
    insertRecruiter,
    updateRecruiter,
    deleteRecruiter,
    countData,
    findEmail
}