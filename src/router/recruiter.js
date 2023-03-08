const express = require("express");
const router = express.Router();

const recruiterController = require("../controller/recruiter");
const upload = require("../middleware/upload");

const authMiddleware = require("../middleware/auth");

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