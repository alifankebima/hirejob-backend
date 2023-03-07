const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const commonHelper = require('../helper/common');

const skillModel = require("../model/skill");


const getWorkerSkills = async (req, res) => {
    try {
        //Get request worker id
        const id = req.params.id;

        //Get all workers from database
        const results = await skillModel.selectWorkerSkills(id);
        
        //Return not found if there's no worker skills in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Skills not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all worker skills successful", pagination);
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting worker skills");
    }
}

// const getDetailSkill = async (req, res) => {
//     try {
//         //Get request worker id
//         const id = req.params.id;

//         //Get worker by id from database
//         const result = await workerModel.selectWorker(id);

//         //Return not found if there's no worker in database
//         if (!result.rowCount) return commonHelper
//             .response(res, null, 404, "Worker not found");

//         //Get worker skills from database
//         const resultSkills = await skillModel.selectWorkerSkills(id);
//         result.rows[0].skills = resultSkills.rows;

//         //Get worker work experiences from database
//         const resultWorkExperiences = await workExperienceModel.selectWorkerExperiences(id);
//         result.rows[0].workExperience = resultWorkExperiences.rows;

//         //Response
//         //Both skills and work experiences will return empty array
//         //If there's no skills or work experiences in database
//         commonHelper.response(res, result.rows, 200,
//             "Get detail worker successful");
//     } catch (error) {
//         console.log(error);
//         commonHelper.response(res, null, 500, "Failed getting detail worker");
//     }
// }

const createSkill = async (req, res) => {
    try {
        //Get request worker id and skill name
        const id_worker = req.payload.id;
        const skillName = req.data.name;

        //Check if skill already exists
        const skillResults = await skillModel.selectSkillName(skillName);

        if(!skillResults.rowCount) {
            const result = awa
        }
        
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed adding worker skill");
    }
}

const updateSkill = async (req, res) => {
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

const deleteSkill = async (req, res) => {
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
    registerWorker,
    loginWorker,
    refreshToken,
    getAllWorkers,
    getDetailWorker,
    updateWorker,
    deleteWorker
}