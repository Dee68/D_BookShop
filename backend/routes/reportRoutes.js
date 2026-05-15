const express = require("express");

const router = express.Router();

const {
    inventoryTextReport,
    inventoryPdfReport
} = require("../controllers/reportController");

const {
    auth,
    requireAdmin
} = require("../middleware/authMiddleware");


// TXT REPORT
router.get(
    "/inventory/txt",
    auth,
    requireAdmin,
    inventoryTextReport
);


// PDF REPORT
router.get(
    "/inventory/pdf",
    auth,
    requireAdmin,
    inventoryPdfReport
);

// CSV REPORT
router.get(
    "/inventory/csv",
    auth,
    requireAdmin,
    inventoryCsvReport
);

module.exports = router;