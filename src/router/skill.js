const express = require("express");
const router = express.Router();

const { protect, isWorker, } = require("../middleware/auth");

const {
    getAllSkills,
    getDetailSkill,
    createSkill,
    deleteSkill
} = require("../controller/skill");

//Skills router
router.get('/', getAllSkills);
router.get('/:id', getDetailSkill);
router.post('/', protect, isWorker, createSkill);
router.delete('/:id', protect, isWorker, deleteSkill);

module.exports = router;