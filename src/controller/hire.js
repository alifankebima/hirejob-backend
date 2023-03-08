const { v4: uuidv4 } = require('uuid');
const commonHelper = require('../helper/common');

const hireModel = require("../model/hire");
const workerModel = require("../model/worker");

const getAllHires = async (req, res) => {
    try {
        //Get all hires from database
        const results = await hireModel.selectAllHires();

        //Return not found if there's no hires in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Hires not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all hires successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting hires");
    }
}

const getWorkerHires = async (req, res) => {
    try {
        //Get request worker id
        const id_worker = req.params.id_worker

        //Get worker hires from database
        const results = await hireModel.selectWorkerHires(id_worker);

        //Return not found if there's no hires in database
        if (!results.rowCount) return commonHelper
            .response(res, null, 404, "Worker hires not found");

        //Response
        commonHelper.response(res, results.rows, 200,
            "Get all hires successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting hires");
    }
}

const getDetailHire = async (req, res) => {
    try {
        //Get request hire id
        const id = req.params.id;

        //Get hire by id from database
        const result = await hireModel.selectHire(id);

        //Return not found if there's no hire in database
        if (!result.rowCount) return commonHelper
            .response(res, null, 404, "Hire not found");

        //Response
        commonHelper.response(res, result.rows, 200,
            "Get detail hire successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed getting detail hire");
    }
}

const createHire = async (req, res) => {
    try {
        //Get request worker id and recruiter id
        const id_worker = req.params.id_worker;
        const id_recruiter = req.payload.id;
        const data = req.body;

        //Check if worker exists
        const workerResult = await workerModel.selectWorker(id_worker);
        if (!workerResult.rowCount) return commonHelper
            .response(res, null, 403, "Worker id is not found");

        //Hire metadata
        data.id = uuidv4();
        data.id_worker = id_worker;
        data.id_recruiter = id_recruiter;
        data.read_status = false;
        data.created_at = Date.now();
        data.updated_at = Date.now();

        //Insert hire to database
        const result = await hireModel.insertHire(data);
    
        //Response
        commonHelper.response(res, result.rows, 200,
            "Create hire successful");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed creating detail hire");
    }
}

const updateHire = async (req, res) => {
    try {
        //Get request hire id and user role
        const id = req.params.id;
        const data = req.body;

        //Hire metadata
        data.id = id;
        data.read_status = false;
        data.updated_at = Date.now();

        //Update hire in database
        const result = await hireModel.updateHire(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Hire updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating hire");
    }
}

const updateHireReadStatus = async (req, res) => {
    try {
        //Get request hire id and hire data
        const id = req.params.id;
        const data = req.body;

        //Hire metadata
        data.id = id;

        //Update hire in database
        const result = await hireModel.updateHireReadStatus(data);

        //Response
        commonHelper.response(res, result.rows, 201, "Hire read status updated");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed updating hire read status");
    }
}

const deleteHire = async (req, res) => {
    try {
        const id = req.params.id;
        const { rowCount } = await hireModel.selectHire(id);
        if (!rowCount) return commonHelper.response(res, null, 404, "Hire not found");

        const result = hireModel.deleteHire(id);
        commonHelper.response(res, result.rows, 200, "Hire deleted");
    } catch (error) {
        console.log(error);
        commonHelper.response(res, null, 500, "Failed deleting hire");
    }
}

module.exports = {
    getAllHires,
    getWorkerHires,
    getDetailHire,
    updateHire,
    updateHireReadStatus,
    deleteHire
}