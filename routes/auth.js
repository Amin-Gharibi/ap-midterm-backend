const express = require("express");

const controller = require("../controllers/auth");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin")

const router = express.Router();
router.post("/register", controller.initialRegister);
router.post('/register/otp', controller.registerValidateOtp);
router.post("/login", controller.initialLogin);
router.post('/login/otp', controller.loginValidationOtp);
router.get("/me", isAuth, controller.getMe);
router.post('/create', isAuth, isAdmin, controller.register)

module.exports = router;
