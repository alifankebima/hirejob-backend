const express = require("express");
const router = express.Router();

const workerRouter = require("./worker");
const recruiterRouter = require("./recruiter");
const skillController = require("./skill");

router.use("/v1/worker", workerRouter);
router.use("/v1/recruiter", recruiterRouter);
router.use("/v1/skill", skillController);

module.exports = router;