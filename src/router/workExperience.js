const express = require("express");
const router = express.Router();

const { protect, isWorker } = require("../middleware/auth");

const {
    getAllWorkExperiences,
    getDetailWorkExperience,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience
} = require("../controller/workExperience");

//WorkExperiences router
router.get('/', getAllWorkExperiences);
router.get('/:id', getDetailWorkExperience);
router.post('/', protect, isWorker, createWorkExperience);
router.put('/:id', protect, isWorker, updateWorkExperience);
router.delete('/:id', protect, isWorker, deleteWorkExperience);

module.exports = router;