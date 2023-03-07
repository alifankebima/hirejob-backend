const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');

const recruiterModel = require("../model/recruiter");

const registerRecruiter = async (req, res) => {
    try {
        //Get request recruiter data
        let data = req.body;

        //Check if email is already used
        const { rowCount } = await recruiterModel.findEmail(data.email);
        if (rowCount) return commonHelper.response(res, null, 403, "Email is already used");

        //Insert recruiter to database
        data.id = uuidv4();
        const salt = bcrypt.genSaltSync(10);
        data.password = bcrypt.hashSync(data.password, salt);
        const result = await recruiterModel.insertRecruiter(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Register recruiter successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed registering recruiter");
    }
}

const loginRecruiter = async (req, res) => {
    try {
        //Get request recruiter login account
        const data = req.body;

        //Check if email exists in database
        const { rowCount, rows: [recruiter] } = await recruiterModel.findEmail(data.email);
        if (!rowCount) return commonHelper.response(res, null, 403, "Email is not registered");

        //Compare password in database
        const isValidPassword = bcrypt.compareSync(data.password, recruiter.password);
        if (!isValidPassword) return commonHelper.response(res, null, 403, "Wrong password");

        //Json Web Token Payload
        const payload = {
            id: recruiter.id,
            email: recruiter.email,
            role: "recruiter"
        };
        recruiter.token = authHelper.generateToken(payload);
        recruiter.refreshToken = authHelper.generateRefreshToken(payload);

        //Response
        delete recruiter.password;
        commonHelper.response(res, recruiter, 200, "Login as recruiter is successful");
    } catch (error) {
        commonHelper.response(res, null, 500, "Failed login as recruiter");
        console.log(error);
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

const getAllRecruiters = async (req, res) => {
    try {
        //Search and pagination query
        const filter = req.query.filter || 'name';
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || 'name';
        const sort = req.query.sort || 'asc';
        const limit = Number(req.query.limit) || 6;
        const page = Number(req.query.page) || 1;
        const offset = (page - 1) * limit;

        //Get all recruiters from database
        const results = await recruiterModel
            .selectAllRecruiters(filter, searchQuery, sortBy, sort, limit, offset);

        //Return not found if there's no recruiters in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Recruiters not found");

        //Pagination info
        const totalData = Number(results.rowCount);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = { currentPage: page, limit, totalData, totalPage };

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all recruiters successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting recruiters");
    }
}

const getDetailRecruiter = async (req, res) => {
    try {
        //Get request recruiter id
        const id = req.params.id;

        //Get recruiter by id from database
        const result = await recruiterModel.selectRecruiter(id);

        //Return not found if there's no recruiter in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Recruiter not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail recruiter successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail recruiter");
    }
}

const updateRecruiter = async (req, res) => {
    try {
        //Get request recruiter id
        const id = req.params.id;
        const newData = req.body;

        //Get previous recruiter data
        const oldDataResult = await recruiterModel.selectRecruiter(id);
        let oldData = oldDataResult.rows[0];

        //Return if recruiter is not found
        if (!oldDataResult.rowCount) return commonHelper.response(res, null, 404, "Recruiter not found");
        data = { ...oldData, ...newData }

        //Update password
        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(newData.password, salt);
        } else {
            data.password = oldData.password;
        }

        const HOST = process.env.RAILWAY_STATIC_URL || 'localhost';
        const PORT = process.env.PORT || 4000;
        
        //Update recruiter profile picture
        if (req.files.image) {
            data.image = `http://${HOST}:${PORT}/img/${req.files.image[0].filename}`;
        } else {
            data.image = oldData.image;
        }

        //Update recruiter banner picture
        if (req.files.banner_image) {
            data.banner_image = `http://${HOST}:${PORT}/img/${req.files.banner_image[0].filename}`;
        } else {
            data.banner_image = oldData.banner_image;
        }

        const result2 = await recruiterModel.updateRecruiter(data);
        commonHelper.response(res, result2.rows, 201, "Recruiter updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating recruiter");
    }
}

const deleteRecruiter = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await recruiterModel.selectRecruiter(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Recruiter not found");

        const result = recruiterModel.deleteRecruiter(id);
        commonHelper.response(res, result.rows, 200, "Recruiter deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting recruiter");
    }
}

module.exports = {
    registerRecruiter,
    loginRecruiter,
    refreshToken,
    getAllRecruiters,
    getDetailRecruiter,
    updateRecruiter,
    deleteRecruiter
}