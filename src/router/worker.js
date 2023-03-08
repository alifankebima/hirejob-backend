// Import express and router
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const { 
    protect, 
    isIdValid, 
    isWorker, 
    isRecruiter 
} = require("../middleware/auth");

const {
    getAllWorkers,
    getDetailWorker,
    registerWorker,
    loginWorker,
    refreshToken,
    updateWorker,
    deleteWorker
} = require("../controller/worker");

const {
    getWorkerSkills,
    createSkill,
    deleteSkill
} = require("../controller/skill");

const {
    getWorkerPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require("../controller/portfolio");

//api_url/v1/worker/...

//Worker authentication routes
router.post("/register", registerWorker);
router.post("/login", loginWorker);
router.post("/refresh-token", refreshToken);

//Worker routes
router.get('/', getAllWorkers);
router.get('/:id_worker', getDetailWorker);
router.put("/:id_worker", protect, isWorker, isIdValid, upload.single("image"), updateWorker);
router.delete("/:id_worker", protect, isWorker, isIdValid, deleteWorker);

//Skill routes
router.get('/:id_worker/skill', getWorkerSkills);
router.post('/skill', protect, isWorker, createSkill);
router.delete('/skill/:id', protect, isWorker, deleteSkill);

//Portfolio routes
router.get('/:id_worker/portfolio', getWorkerPortfolio);
router.post('/portfolio', protect, isWorker, createPortfolio);
router.put('/portfolio/:id', protect, isWorker, updatePortfolio);
router.delete('/portfolio/:id', protect, isWorker, deletePortfolio);

//Export router to index.js at router folder
module.exports = router;