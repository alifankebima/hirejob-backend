// Import express and router
const express = require("express");
const router = express.Router();

//Import controller functions
const recruiterController = require("../controller/recruiter");
const upload = require("../middleware/upload");

// Import auth
const authMiddleware = require("../middleware/auth");

//Recruiter router
router.get('/', recruiterController.getAllRecruiters);
router.get('/:id', recruiterController.getDetailRecruiter);
router.post("/register", recruiterController.registerRecruiter);
router.post("/login", recruiterController.loginRecruiter);
router.post("/refresh-token", recruiterController.refreshToken);

//Require login
router.put("/:id", authMiddleware.protect, authMiddleware.isIdValid, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner_image", maxCount: 1 }
]), recruiterController.updateRecruiter);
router.delete("/:id", authMiddleware.protect, authMiddleware.isIdValid, recruiterController.deleteRecruiter);

//Export router to index.js at router folder
module.exports = router;