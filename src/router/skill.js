const express = require("express");
const router = express.Router();

const {
    getAllSkills,
    getDetailSkill
} = require("../controller/skill");

//Skills router
//api_router/v1/skill/...
router.get('/', getAllSkills);
router.get('/:id', getDetailSkill);

module.exports = router;