const express = require("express");

const controller = require("../controllers/universalSearch");

const router = express.Router();
router.get("/", controller.universalSearch);

module.exports = router;