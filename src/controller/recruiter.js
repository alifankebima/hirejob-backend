const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');
const authHelper = require('../helper/auth');
const googleDrive = require('../config/googleDrive');
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
        recruiter.role = "recruiter"
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

const getProfile = async (req, res) => {
    const id = req.payload.id;

    const result = await recruiterModel.selectRecruiter(id);
    if(!result.rowCount) return commonHelper
        .response(res, null, 404, "Recruiter not found");

    result.rows[0].role = "recruiter";
    delete result.rows[0].password;
    commonHelper.response(res, result.rows, 200, "Get recruiter profile successful")
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
        const id = req.params.id_recruiter;

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
        const id = req.params.id_recruiter;
        const newData = req.body;
        let image =""
        //Get previous recruiter data
        const oldDataResult = await recruiterModel.selectRecruiter(id);
        let oldData = oldDataResult.rows[0];

        //Return if recruiter is not found
        if (!oldDataResult.rowCount) return commonHelper.response(res, null, 404, "Recruiter not found");
        let data = {}
        data = { ...oldData, ...newData }

        //Update password
        if (newData.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(newData.password, salt);
        } else {
            data.password = oldData.password;
        }

        // Update image if image already exists in database
        if (req.files.image != undefined && oldData.image != null) {
            const oldImage = oldData.image;
            const oldImageId = oldImage.split("=")[1];
            const updateResult = await googleDrive.updateImage(req.files.image[0], oldImageId)
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            data.image = parentPath.concat(updateResult.id)

            // Upload image if image doesn't exists in database
        } else if (req.files.image != undefined && oldData.image == null) {
            const uploadResult = await googleDrive.uploadImage(req.files.image[0])
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            image = parentPath.concat(uploadResult.id)
            
            // Use old image if user doesn't upload image
        } else {
            data.image = oldData.image;
        }

        // Update banner image if image already exists in database
        if (req.files.banner_image != undefined && oldData.banner_image != null) {
            const oldImage = oldData.banner_image;
            const oldImageId = oldImage.split("=")[1];
            const updateResult = await googleDrive.updateImage(req.files.banner_image[0], oldImageId)
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            data.banner_image = parentPath.concat(updateResult.id)

            // Upload banner image if image doesn't exists in database
        } else if (req.files.banner_image != undefined && oldData.banner_image == null) {
            const uploadResult = await googleDrive.uploadImage(req.files.banner_image[0])
            const parentPath = process.env.GOOGLE_DRIVE_PHOTO_PATH;
            data.banner_image = parentPath.concat(uploadResult.id)

            // Use old banner image if user doesn't upload image
        } else {
            data.image = oldData.banner_image;
        }

        data.image = image
        console.log(" a: "+data.image)
        const result2 = await recruiterModel.updateRecruiter(data);
        commonHelper.response(res, result2.rows, 201, "Recruiter updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating recruiter");
    }
}

const deleteRecruiter = async (req, res) => {
    try {
        const id = req.params.id_recruiter;
        const oldResult = await recruiterModel.selectRecruiter(id);
        if (!oldResult.rowCount) return commonHelper.response(res, null, 404, "Recruiter not found");

        const oldPhoto = oldResult.rows[0].image;
        if(oldResult.rows[0].image != null){
            const oldPhotoId = oldPhoto.split("=")[1];
            await googleDrive.deleteImage(oldPhotoId);
        }

        const oldBannerImage = oldResult.rows[0].banner_image;
        if(oldResult.rows[0].image != null){
            const oldPhotoId = oldBannerImage.split("=")[1];
            await googleDrive.deleteImage(oldPhotoId);
        }

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
    getProfile,
    refreshToken,
    getAllRecruiters,
    getDetailRecruiter,
    updateRecruiter,
    deleteRecruiter
}