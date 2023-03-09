const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { protect, isWorker } = require("../middleware/auth");

const {
    getAllPortfolios,
    getDetailPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require("../controller/portfolio");

//Portfolios router
//api_router/v1/portfolio/...
router.get('/', getAllPortfolios);
router.get('/:id', getDetailPortfolio);
router.post('/', protect, isWorker, upload.single("image"), createPortfolio);
router.put('/:id', protect, isWorker, upload.single("image"), updatePortfolio);
router.delete('/:id', protect, isWorker, deletePortfolio);

module.exports = router;