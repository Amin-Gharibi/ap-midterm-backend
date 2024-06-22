const express = require("express")
const multer = require("multer")

const multerStorage = require("../utils/multerStorage");
const controller = require("../controllers/articles");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router
	.route('/')
	.get(controller.getAll)
	.post(isAuth, multer({
		storage: multerStorage.articlesCoversStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "cover", maxCount: 1}
	]), controller.create)

router
	.route('/published')
	.get(controller.getAllPublished)

router
	.route('/me')
	.get(isAuth, controller.getMyArticles)

router
	.route('/status/:id')
	.put(isAuth, controller.changeStatus)

router
	.route('/search')
	.get(controller.searchHandler)

router
	.route('/latest')
	.get(controller.getLatest)

router
	.route('/:id')
	.get(isAuth, controller.getOne)
	.delete(isAuth, controller.delete)
	.put(isAuth, isAdmin, multer({
		storage: multerStorage.articlesCoversStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "cover", maxCount: 1}
	]), controller.update)

module.exports = router