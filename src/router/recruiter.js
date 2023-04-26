const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect, isIdValid } = require("../middleware/auth");

const {
    getAllRecruiters,
    getDetailRecruiter,
    registerRecruiter,
    loginRecruiter,
    refreshToken,
    updateRecruiter,
    deleteRecruiter
} = require("../controller/recruiter");

//Recruiter authentication routes
router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);
router.post("/refresh-token", refreshToken);

//Recruiter routes
router.get('/', getAllRecruiters);
router.get('/:id_recruiter', getDetailRecruiter);
router.put("/:id_recruiter", protect, isIdValid, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner_image", maxCount: 1 }
]), updateRecruiter);
router.delete("/:id_recruiter", protect, isIdValid, deleteRecruiter);

//Export router to index.js at router folder
module.exports = router;