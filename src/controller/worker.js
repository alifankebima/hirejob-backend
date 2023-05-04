const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');
const googleDrive = require('../config/googleDrive');
const workerModel = require("../model/worker");
const skillModel = require("../model/skill");
const portfolioModel = require("../model/portfolio");
const workExperienceModel = require("../model/workExperience");
const hireModel = require("../model/hire")

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
        const hires = await hireModel.selectWorkerHires(worker.id);
        worker.hireCount = hires.rowCount;
        worker.role = "worker";
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

const getProfile = async (req, res) => {
    const id = req.payload.id;

    const result = await workerModel.selectWorker(id);
    if(!result.rowCount) return commonHelper
        .response(res, null, 404, "Worker not found");

    const hires = await hireModel.selectWorkerHires(id);
    result.rows[0].hireCount = hires.rowCount;
    result.rows[0].role = "worker";
    delete result.rows[0].password;
    commonHelper.response(res, result.rows, 200, "Get worker profile successful")
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
        result.rows[0].skill = resultSkills.rows;

        //Get portfolios from database
        const resultPortfolios = await portfolioModel.selectWorkerPortfolios(id);
        result.rows[0].portfolio = resultPortfolios.rows;

        //Get worker work experiences from database
        const resultWorkExperiences = await workExperienceModel.selectWorkerWorkExperiences(id);
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
        let data = { ...oldData, ...newData }

        //Update password
        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(newData.password, salt);
        } else {
            data.password = oldData.password;
        }

        // Update image if image already exists in database
        if (req.file && oldData.image != null) {
            const oldImage = oldData.image;
            const oldImageId = oldImage.split("=")[1];
            const updateResult = await googleDrive.updateImage(req.file, oldImageId)
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            data.image = parentPath.concat(updateResult.id)

            // Upload image if image doesn't exists in database
        } else if (req.file && oldData.image == null) {
            const uploadResult = await googleDrive.uploadImage(req.file)
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            data.image = parentPath.concat(uploadResult.id)

            // Use old image if user doesn't upload image
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
        const id = req.params.id_worker;
        const oldResult = await workerModel.selectWorker(id);
        if (!oldResult.rowCount) return commonHelper.response(res, null, 404, "Worker not found");

        const oldPhoto = oldResult.rows[0].image;
        if(oldPhoto != null){
            const oldPhotoId = oldPhoto.split("=")[1];
            await googleDrive.deleteImage(oldPhotoId);
        }
        
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
    getProfile,
    refreshToken,
    getAllWorkers,
    getDetailWorker,
    updateWorker,
    deleteWorker
}