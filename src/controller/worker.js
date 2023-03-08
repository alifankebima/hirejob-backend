const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');

const workerModel = require("../model/worker");
const skillModel = require("../model/skill");
const portfolioModel = require("../model/portfolio");
const workExperienceModel = require("../model/workExperience");

const registerWorker = async (req, res) => {
    try {
        //Get request worker data
        let data = req.body;

        //Check if email is already used
        const { rowCount } = await workerModel.findEmail(data.email);
        if (rowCount) return commonHelper.response(res, null, 403, "Email is already used");

        //Insert worker to database
        data.id = uuidv4();
        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        const result = await workerModel.insertWorker(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Register worker successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed registering worker");
    }
}

const loginWorker = async (req, res) => {
    try {
        //Get request worker login account
        const data = req.body;

        //Check if email exists in database
        const { rowCount, rows: [worker] } = await workerModel.findEmail(data.email);
        if (!rowCount) return commonHelper.response(res, null, 403, "Email is not registered");

        //Compare password in database
        const isValidPassword = bcrypt.compareSync(data.password, worker.password);
        if (!isValidPassword) return commonHelper.response(res, null, 403, "Wrong password");

        //Json Web Token Payload
        const payload = {
            id: worker.id,
            email: worker.email,
            role: "worker"
        };
        worker.token = authHelper.generateToken(payload);
        worker.refreshToken = authHelper.generateRefreshToken(payload);

        //Response
        delete worker.password;
        commonHelper.response(res, worker, 200, "Login as worker is successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed login as worker");
    }
}

const refreshToken = async (req, res) => {
    try {
        //Get request refresh token
        const data = req.body.refreshToken;

        //Verify refresh token
        const decoded = jwt.verify(data, process.env.SECRET_KEY_JWT);

        //Token payload
        let payload = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        //New refreshed token
        const result = {
            token: authHelper.generateToken(payload),
            refreshToken: authHelper.generateRefreshToken(payload),
        };

        //Response
        commonHelper.response(res, result, 200);
    } catch (error) {
        console.log(error);
        if (error.name == "JsonWebTokenError") {
            return commonHelper.response(res, null, 401, "Token invalid");
        } else if (error.name == "TokenExpiredError") {
            return commonHelper.response(res, null, 401, "Token expired");
        } else {
            return commonHelper.response(res, null, 401, "Token not active");
        }
    }
}

const getAllWorkers = async (req, res) => {
    try {
        //Search and pagination query
        const filter = req.query.filter || 'name';
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'name';
        const sort = req.query.sort || 'asc';
        const limit = Number(req.query.limit) || 6;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        //Get all workers from database
        const results = await workerModel
            .selectAllWorkers(filter, searchQuery, sortBy, sort, limit, offset);

        //Return not found if there's no workers in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Workers not found");

        //Pagination info
        const totalData = Number(results.rowCount);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all workers successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting workers");
    }
}

const getDetailWorker = async (req, res) => {
    try {
        //Get request worker id
        const id = req.params.id_worker;

        //Get worker by id from database
        const result = await workerModel.selectWorker(id);

        //Return not found if there's no worker in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Worker not found");

        //Get worker skills from database
        const resultSkills = await skillModel.selectWorkerSkills(id);
        result.rows[0].skill = resultSkills.rows.map((skill) => skill.name);

        //Get portfolios from database
        const resultPortfolios = await portfolioModel.selectWorkerPortfolios(id);
        result.rows[0].portfolio = resultPortfolios.rows;

        //Get worker work experiences from database
        const resultWorkExperiences = await workExperienceModel.selectWorkerExperiences(id);
        result.rows[0].workExperience = resultWorkExperiences.rows;

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail worker successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail worker");
    }
}

const updateWorker = async (req, res) => {
    try {
        //Get request worker id
        const id = req.params.id_worker;
        const newData = req.body;

        //Get previous worker data
        const oldDataResult = await workerModel.selectWorker(id);
        if (!oldDataResult.rowCount) return commonHelper.response(res, null, 404, "Worker not found");
        let oldData = oldDataResult.rows[0];
        data = { ...oldData, ...newData }

        //Update password
        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(newData.password, salt);
        } else {
            data.password = oldData.password;
        }

        //Update worker profile picture
        if (req.file) {
            const HOST = process.env.RAILWAY_STATIC_URL || 'localhost';
            const PORT = process.env.PORT || 4000;
            data.image = `http://${HOST}:${PORT}/img/${req.file.filename}`;
        } else {
            data.image = oldData.image;
        }

        //Update worker in database
        const result = await workerModel.updateWorker(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Worker updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating worker");
    }
}

const deleteWorker = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await workerModel.selectWorker(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Worker not found");

        const result = workerModel.deleteWorker(id);
        commonHelper.response(res, result.rows, 200, "Worker deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting worker");
    }
}

module.exports = {
    registerWorker,
    loginWorker,
    refreshToken,
    getAllWorkers,
    getDetailWorker,
    updateWorker,
    deleteWorker
}