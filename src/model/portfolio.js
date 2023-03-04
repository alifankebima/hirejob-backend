const pool = require('../config/db');

const selectWorkerPortfolios = (id_worker) => {
        pool.query(`SELECT * FROM portfolios WHERE id_worker='${id_worker}'`);
}

const selectPortfolio = (id) => {
    return new Promise((resolve, reject) =>
        pool.query(`SELECT * FROM portfolios where id='${id}'`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

const insertPortfolio = (data) => {
    const { id, id_worker, name, repo_link, portfolio_type, image } = data;
    return pool.query(`INSERT INTO portfolios VALUES('${id}', '${id_worker}', 
        '${name}', '${repo_link}', '${portfolio_type}', '${image}')`);
}

const updatePortfolio = (data) => {
    const { id, id_worker, name, repo_link, portfolio_type, image } = data;
    return pool.query(`UPDATE portfolios SET name='${name}', 
        repo_link='${repo_link}', portfolio_type='${portfolio_type}', 
        image='${image}', WHERE id='${id}'`);
}

const deletePortfolio = (id) => {
    return pool.query(`DELETE FROM portfolios WHERE id='${id}'`);
}

const countData = () => {
    return new Promise((resolve, reject) =>
        pool.query(`select count(id) from portfolios`,
            (error, result) => (!error) ? resolve(result) : reject(error)));
}

module.exports = {
    selectWorkerPortfolios,
    selectPortfolio,
    insertPortfolio,
    updatePortfolio,
    deletePortfolio,
    countData
}