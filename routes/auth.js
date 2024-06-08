const express = require("express");
const multer = require("multer");

const multerStorage = require("../utils/multerStorage");
const controller = require("../controllers/auth");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();
router.post("/register", multer({ storage: multerStorage.userProfilePicturesStorage, limits: { fileSize: 1000000000 } }).single("profilePic"), controller.register);
router.post("/login", controller.login);
router.get("/me", isAuth, controller.getMe);

module.exports = router;
