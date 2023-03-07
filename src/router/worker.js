// Import express and router
const express = require("express");
const router = express.Router();

//Import controller functions
const workerController = require("../controller/worker");
const upload = require("../middleware/upload");

// Import auth
const authMiddleware = require("../middleware/auth");

//Worker router
router.get('/', workerController.getAllWorkers);
router.get('/:id', workerController.getDetailWorker);
router.post("/register", workerController.registerWorker);
router.post("/login", workerController.loginWorker);
router.post("/refresh-token", workerController.refreshToken);

//Require login
router.put("/:id", authMiddleware.protect, authMiddleware.isIdValid, upload.single("image"), workerController.updateWorker);
router.delete("/:id", authMiddleware.protect, authMiddleware.isIdValid, workerController.deleteWorker);

//Export router to index.js at router folder
module.exports = router;