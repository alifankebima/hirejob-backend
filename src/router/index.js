// Import express and router
const express = require("express");
const router = express.Router();

// Import route
const workerRouter = require("./worker");
const recruiterRouter = require("./recruiter");

// Use route
router.use("/v1/worker", workerRouter);
router.use("/v1/recruiter", recruiterRouter);

// Export router
module.exports = router;