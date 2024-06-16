const express = require("express");
const multer = require("multer");

const multerStorage = require("../utils/multerStorage");
const controller = require("../controllers/castUser");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router
	.route('/')
	.get(controller.getAll)
	.post(isAuth, isAdmin, multer({
		storage: multerStorage.moviesPicturesStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "profilePic", maxCount: 1},
		{name: "photos", maxCount: 10}
	]), controller.create);

router
	.route('/search')
	.get(controller.searchHandler)

router
	.route('/toprated')
	.get(controller.getTopRated)

router
	.route('/:id')
	.get(controller.getOne)
	.delete(isAuth, isAdmin, controller.delete)
	.put(isAuth, isAdmin, multer({
		storage: multerStorage.moviesPicturesStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "profilePic", maxCount: 1},
		{name: "photos", maxCount: 10}
	]), controller.update)

module.exports = router;
