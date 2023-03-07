const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');

const workexperienceModel = require("../model/workExperience");


const getWorkerExperiences = async (req, res) => {
    try {
        //Get request worker id
        const id = req.params.id;

        //Get all workers from database
        const results = await workexperienceModel.selectWorkerExperiences(id);
        
        //Return not found if there's no worker workexperiences in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "WorkExperiences not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all worker workexperiences successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting worker workexperiences");
    }
}

// const getDetailWorkExperience = async (req, res) => {
//     try {
//         //Get request worker id
//         const id = req.params.id;

//         //Get worker by id from database
//         const result = await workerModel.selectWorker(id);

//         //Return not found if there's no worker in database
//         if (!result.rowCount) return commonHelper
//             .response(res, null, 404, "Worker not found");

//         //Get worker workexperiences from database
//         const resultWorkExperiences = await workexperienceModel.selectWorkerWorkExperiences(id);
//         result.rows[0].workexperiences = resultWorkExperiences.rows;

//         //Get worker work experiences from database
//         const resultWorkExperiences = await workExperienceModel.selectWorkerExperiences(id);
//         result.rows[0].workExperience = resultWorkExperiences.rows;

//         //Response
//         //Both workexperiences and work experiences will return empty array
//         //If there's no workexperiences or work experiences in database
//         commonHelper.response(res, result.rows, 200,
//             "Get detail worker successful");
//     } catch (error) {
//         console.log(error);
//         commonHelper.response(res, null, 500, "Failed getting detail worker");
//     }
// }

const createWorkExperience = async (req, res) => {
    try {
        //Get request worker id
        const id_worker = req.payload.id;
        
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed adding worker workexperience");
    }
}

const updateWorkExperience = async (req, res) => {
    try {
        //Get request worker data and id
        const data = req.body;
        const id = req.params.id;
        const { rowCount } = await workerModel.selectWorker(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Worker not found");

        data.id = id;
        const result = await workerModel.updateWorker(id);
        commonHelper.response(res, result.rows, 201, "Worker updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating worker");
    }
}

const deleteWorkExperience = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await workerModel.selectWorker(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Worker not found");
  
        const result = workerModel.deleteWorker(id);
        commonHelper.response(res, result.rows, 200, "Worker deleted");
      } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating worker");
      }
}

module.exports = {
    getAllWorkerExperience,
    getDetailWorker,
    updateWorkExperience,
    deleteWorkExperience
}