const express = require("express");
const router = express.Router();

const workerRouter = require("./worker");
const skillController = require("./skill");
const portfolioController = require("./portfolio");
const workExperienceController = require("./workExperience");
const recruiterRouter = require("./recruiter");
const hireRouter = require("./hire");

router.use("/v1/worker", workerRouter);
router.use("/v1/skill", skillController);
router.use("/v1/portfolio", portfolioController);
router.use("/v1/work-experience", workExperienceController);
router.use("/v1/recruiter", recruiterRouter);
router.use("/v1/hire", hireRouter);

module.exports = router;