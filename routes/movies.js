const express = require("express")
const multer = require("multer")

const multerStorage = require("../utils/multerStorage");
const controller = require("../controllers/movies");
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
		{name: "cover", maxCount: 1},
		{name: "medias", maxCount: 10}
	]), controller.create)

router
	.route('/approve')
	.get(controller.getAllApproved)

router
	.route('/status/:id')
	.put(isAuth, isAdmin, controller.changeStatus)

router
	.route('/search')
	.get(controller.searchHandler)

router
	.route('/:id')
	.get(controller.getOne)
	.delete(isAuth, isAdmin, controller.delete)
	.put(isAuth, isAdmin, multer({
		storage: multerStorage.moviesPicturesStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "cover", maxCount: 1},
		{name: "medias", maxCount: 10}
	]), controller.update)

module.exports = router