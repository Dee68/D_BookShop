const express = require("express");
const router = express.Router();
const { auth, requireAdmin } = require("../middleware/authMiddleware");
const controller = require("../controllers/contactController");
// const {
//     sendMessage
// } = require("../controllers/contactController");

router.post("/", controller.sendMessage);
//router.get("/", auth, requireAdmin, controller.getAllMessages);
//router.delete("/:id", auth, requireAdmin, controller.deleteMessage);

module.exports = router;