const { v4: uuidv4 } = require('uuid');
const commonHelper = require('../helper/common');

const skillModel = require("../model/skill");

const getAllSkills = async (req, res) => {
    try {
        //Get all skills from database
        const results = await skillModel.selectAllSkills();

        //Return not found if there's no skills in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Skills not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all skills successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting skills");
    }
}

const getWorkerSkills = async (req, res) => {
    try {
        //Get request worker id
        const id_worker = req.params.id_worker

        //Get worker skills from database
        const results = await skillModel.selectWorkerSkills(id_worker);

        //Return not found if there's no skills in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Worker skills not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all skills successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting skills");
    }
}

const getDetailSkill = async (req, res) => {
    try {
        //Get request skill id
        const id = req.params.id;

        //Get skill by id from database
        const result = await skillModel.selectSkill(id);

        //Return not found if there's no skill in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Skill not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail skill successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail skill");
    }
}

const createSkill = async (req, res) => {
    try {
        //Get request worker id
        const id_worker = req.payload.id;
        const data = req.body;
        const result = {};

        //Check if skill name exists in database
        const skillResult = await skillModel.selectSkillName(data.name);
        
        //if skill exists, use existing skill and add skill relation to worker
        if(skillResult.rowCount){
            const insertSkill = {
                id: uuidv4(),
                id_worker: id_worker,
                id_skill: skillResult.rows[0].id
            }
            result = await skillModel.insertWorkerSkill(insertSkill);
        
        //Otherwhise, add skill name and then add skill relation to worker
        } else {
            const newSkill = {
                id: uuidv4(),
                name: data.name
            }
            const newSkillResult = await skillModel.insertSkill(newSkill);

            const insertSkill = {
                id: uuidv4(),
                id_worker: id_worker,
                id_skill: newSkill.id
            }
            result = await skillModel.insertWorkerSkill(insertSkill);
        }
    
        //Response
        commonHelper.response(res, result.rows, 200,
            "Create skill successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating detail skill");
    }
}

const deleteSkill = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await skillModel.selectSkill(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Skill not found");

        const result = skillModel.deleteWorkerSkill(id);
        commonHelper.response(res, result.rows, 200, "Skill deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting skill");
    }
}

module.exports = {
    getAllSkills,
    getWorkerSkills,
    getDetailSkill,
    createSkill,
    deleteSkill
}