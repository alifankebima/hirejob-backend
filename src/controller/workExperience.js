const { v4: uuidv4 } = require('uuid');
const commonHelper = require('../helper/common');

const workExperienceModel = require("../model/workExperience");
const workerModel = require("../model/worker");

const getAllWorkExperiences = async (req, res) => {
    try {
        //Get all work experiences from database
        const results = await workExperienceModel.selectWorkExperience();

        //Return not found if there's no work experiences in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Work experiences not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all work experiences successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting work experiences");
    }
}

const getWorkerWorkExperiences = async (req, res) => {
    try {
        //Get request worker id
        const id_worker = req.params.id_worker;

        //Get worker work experiences from database
        const results = await workExperienceModel.selectWorkerWorkExperiences(id_worker);

        //Return not found if there's no worker's work experiences in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Worker's work experiences not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get worker's work experiences successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting work experiences");
    }
}

const getDetailWorkExperience = async (req, res) => {
    try {
        //Get request workexperience id
        const id = req.params.id;

        //Get workexperience by id from database
        const result = await workExperienceModel.selectWorkExperience(id);

        //Return not found if there's no workexperience in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Work experience not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail work experience successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail work experience");
    }
}

const createWorkExperience = async (req, res) => {
    try {
        //Get request worker id and work experience data
        const id_worker = req.payload.id_worker;
        const data = req.body;

        //Work experience metadata
        data.id = uuidv4();
        data.id_worker = id_worker;
        if (req.file) {
            const HOST = process.env.RAILWAY_STATIC_URL || 'localhost';
            const PORT = process.env.PORT || 4000;
            data.image = `http://${HOST}:${PORT}/img/${req.file.filename}`;
        }

        //Insert work experience to database
        const result = await workExperienceModel.insertWorkExperience(data);

        //Response
        commonHelper.response(res, result.rows, 200,
            "Create work experience successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating work experience");
    }
}

const updateWorkExperience = async (req, res) => {
    try {
        //Get request worker id and work experience data
        const id = req.params.id;
        const id_worker = req.payload.id_worker;
        const newData = req.body;

        //Get previous work experience data
        const oldDataResult = await workExperienceModel.selectWorkExperience(id);
        if (!oldDataResult.rowCount) return commonHelper
            .response(res, null, 404, "Work experience not found");
        let oldData = oldDataResult.rows[0];
        data = { ...oldData, ...newData }

        //Work experience metadata
        data.id = id;
        data.id_worker = id_worker;
        if (req.file) {
            const HOST = process.env.RAILWAY_STATIC_URL || 'localhost';
            const PORT = process.env.PORT || 4000;
            data.image = `http://${HOST}:${PORT}/img/${req.file.filename}`;
        } else {
            data.image = oldData.image;
        }

        //Insert update to database
        const result = await workExperienceModel.updateWorkExperience(data);

        //Response
        commonHelper.response(res, result.rows, 200,
            "Update work experience successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating work experience");
    }
}

const deleteWorkExperience = async (req, res) => {
    try {
        //Get request workexperience id
        const id = req.params.id;

        //Check if workexperience exists in database
        const { rowCount } = await workExperienceModel.selectWorkExperience(id);
        if (!rowCount) return commonHelper
            .response(res, null, 404, "Work experience not found");

        //Delete workexperience from database
        const result = workExperienceModel.deleteWorkExperience(id);

        //Response
        commonHelper.response(res, result.rows, 200, "Work experience deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting work experience");
    }
}

module.exports = {
    getAllWorkExperiences,
    getWorkerWorkExperiences,
    getDetailWorkExperience,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
}