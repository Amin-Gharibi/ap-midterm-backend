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
	.post(isAuth, isAdmin, multer({
		storage: multerStorage.articlesCoversStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "cover", maxCount: 1}
	]), controller.create)

router
	.route('/approve')
	.get(controller.getAllApproved)

router
	.route('/status/:id')
	.put(isAuth, isAdmin, controller.changeStatus)

router
	.route('/search')
	.get(isAuth, controller.searchHandler)

router
	.route('/:id')
	.get(isAuth, controller.getOne)
	.delete(isAuth, isAdmin, controller.delete)
	.put(isAuth, isAdmin, multer({
		storage: multerStorage.articlesCoversStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "cover", maxCount: 1}
	]), controller.update)

module.exports = router