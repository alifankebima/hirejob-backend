// Import express and router
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect, isIdValid, isWorker, isRecruiter } = require("../middleware/auth");

const { getWorkerSkills } = require("../controller/skill");
const { getWorkerPortfolios } = require("../controller/portfolio");
const { getWorkerWorkExperiences } = require("../controller/workExperience");
const { getWorkerHires, createHire } = require("../controller/hire");
const {
    getAllWorkers,
    getDetailWorker,
    registerWorker,
    loginWorker,
    refreshToken,
    updateWorker,
    deleteWorker,
    getProfile
} = require("../controller/worker");

//Worker authentication routes
router.post("/register", registerWorker);
router.post("/login", loginWorker);
router.post("/refresh-token", refreshToken);

//Worker routes
router.get('/', getAllWorkers);
router.get('/profile', protect, getProfile);
router.get('/:id_worker', getDetailWorker);
router.put("/:id_worker", protect, isWorker, isIdValid, upload.single("image"), updateWorker);
router.delete("/:id_worker", protect, isWorker, isIdValid, deleteWorker);

//Additional worker routes
router.get('/:id_worker/skill', getWorkerSkills);
router.get('/:id_worker/portfolio', getWorkerPortfolios);
router.get('/:id_worker/work-experience', getWorkerWorkExperiences);
router.get('/:id_worker/hire', getWorkerHires);
//For recruiter
router.post('/:id_worker/hire', protect, isRecruiter, createHire);

//Export router to index.js at router folder
module.exports = router;