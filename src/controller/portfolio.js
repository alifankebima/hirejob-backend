const { v4: uuidv4 } = require('uuid');
const commonHelper = require('../helper/common');
const googleDrive = require('../config/googleDrive');
const portfolioModel = require("../model/portfolio");

const getAllPortfolios = async (req, res) => {
    try {
        //Get all portfolios from database
        const results = await portfolioModel.selectAllPortfolios();

        //Return not found if there's no portfolios in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Portfolios not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all portfolios successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting portfolios");
    }
}

const getWorkerPortfolios = async (req, res) => {
    try {
        //Get request worker id
        const id_worker = req.params.id_worker;

        //Get worker portfolios from database
        const results = await portfolioModel.selectWorkerPortfolios(id_worker);

        //Return not found if there's no portfolios in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Worker portfolios not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get worker portfolios successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting portfolios");
    }
}

const getDetailPortfolio = async (req, res) => {
    try {
        //Get request portfolio id
        const id = req.params.id;

        //Get portfolio by id from database
        const result = await portfolioModel.selectPortfolio(id);

        //Return not found if there's no portfolio in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Portfolio not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail portfolio successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail portfolio");
    }
}

const createPortfolio = async (req, res) => {
    try {
        //Get request worker id and portfolio data
        const id_worker = req.payload.id;
        const data = req.body;

        //Check if image is uploaded
        if (req.file == undefined) return commonHelper
            .response(res, null, 400, "Please input image");

        //Portfolio metadata
        data.id = uuidv4();
        data.id_worker = id_worker;
        if (req.file) {
            const uploadResult = await googleDrive.uploadImage(req.file)
            const parentPathprefix = process.env.GOOGLE_DRIVE_PHOTO_PATH_PREFIX;
            const parentPathPostfix = process.env.GOOGLE_DRIVE_PHOTO_PATH_POSTFIX;
            data.image = parentPathPrefix + uploadResult.id + parentPathPostfix
        }

        //Insert portfolio to database
        const result = await portfolioModel.insertPortfolio(data);
    
        //Response
        commonHelper.response(res, result.rows, 200,
            "Create portfolio successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating portfolio");
    }
}

const updatePortfolio = async (req, res) => {
    try {
        //Get request worker id and portfolio data
        const id = req.params.id;
        const id_worker = req.payload.id_worker;
        const newData = req.body;

        //Get previous portfolio
        const oldDataResult = await portfolioModel.selectPortfolio(id);
        if (!oldDataResult.rowCount) return commonHelper
            .response(res, null, 404, "Portfolio not found");
        let oldData = oldDataResult.rows[0];
        let data = { ...oldData, ...newData }

        //Portfolio metadata
        data.id = id;
        data.id_worker = id_worker;
        // Update image if image already exists in database
        if (req.file && oldData.image != "") {
            const oldImage = oldData.image;
            const oldImageId = oldImage.split("=")[1];
            const updateResult = await googleDrive.updateImage(req.file, oldImageId)
            const parentPathprefix = process.env.GOOGLE_DRIVE_PHOTO_PATH_PREFIX;
            const parentPathPostfix = process.env.GOOGLE_DRIVE_PHOTO_PATH_POSTFIX;
            data.image = parentPathPrefix + updateResult.id + parentPathPostfix

            // Upload image if image doesn't exists in database
        } else if (req.file && oldData.image == "") {
            const uploadResult = await googleDrive.uploadImage(req.file)
            const parentPathprefix = process.env.GOOGLE_DRIVE_PHOTO_PATH_PREFIX;
            const parentPathPostfix = process.env.GOOGLE_DRIVE_PHOTO_PATH_POSTFIX;
            data.image = parentPathPrefix + uploadResult.id + parentPathPostfix

            // Use old image if user doesn't upload image
        } else {
            data.image = oldData.image;
        }

        //Insert update to database
        const result = await portfolioModel.updatePortfolio(data);
    
        //Response
        commonHelper.response(res, result.rows, 200,
            "Update portfolio successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating portfolio");
    }
}

const deletePortfolio = async (req, res) => {
    try {
        //Get request portfolio id
        const id = req.params.id;

        //Check if portfolio exists in database
        const oldResult = await portfolioModel.selectPortfolio(id);
        if (!oldResult.rowCount) return commonHelper
            .response(res, null, 404, "Portfolio not found");
        
        // Delete user's image
        const oldPhoto = oldResult.rows[0].image;
        if(oldPhoto != null){
            const oldPhotoId = oldPhoto.split("=")[1];
            await googleDrive.deleteImage(oldPhotoId);
        }

        //Delete portfolio from database
        const result = portfolioModel.deletePortfolio(id);

        //Response
        commonHelper.response(res, result.rows, 200, "Portfolio deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting portfolio");
    }
}

module.exports = {
    getAllPortfolios,
    getWorkerPortfolios,
    getDetailPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
}