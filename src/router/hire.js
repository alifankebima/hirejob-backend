const express = require("express");
const router = express.Router();

const {
    getAllHires,
    getDetailHire,
    updateHire,
    updateHireReadStatus,
    deleteHire
} = require("../controller/hire");
const { isRecruiter, protect, isWorker } = require("../middleware/auth");

//Hires router
router.get('/', getAllHires);
router.get('/:id', getDetailHire);
router.post('/read-status/:id', protect, isWorker, updateHireReadStatus);
router.put('/:id', protect, isRecruiter, updateHire);
router.delete('/:id', protect, deleteHire);

module.exports = router;