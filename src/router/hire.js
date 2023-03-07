// Import express and router
const express = require("express");
const router = express.Router();

//Import controller functions
const hireController = require("../controller/hire");

// Import auth
const authMiddleware = require("../middleware/auth");

//Hire router
router.get('/', hireController.getAllHires);
router.get('/worker/:id_worker', hireController.getWorkerHires);
router.get('/detail/:id', hireController.getDetailHire);

//Require login
router.post('/worker/:id_worker', hireController.getWorkerHires);
router.put("/:id", hireController.updateHire);
router.delete("/:id", authMiddleware.protect, authMiddleware.isIdValid, hireController.deleteHire);

//Export router to index.js at router folder
module.exports = router;