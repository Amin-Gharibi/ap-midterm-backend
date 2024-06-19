const express = require("express")
const multer = require("multer")

const controller = require("../controllers/normalUser")
const isAuth = require("../middlewares/isAuth")
const isAdmin = require("../middlewares/isAdmin")
const multerStorage = require("../utils/multerStorage");

const router = express.Router()

router
	.route('/')
	.get(isAuth, isAdmin, controller.getAll)

router
	.route('/waitlist')
	.get(isAuth, isAdmin, controller.getWaitList)

router
	.route('/search')
	.get(isAuth, isAdmin, controller.search)

router
	.route('/approve/:id')
	.put(isAuth, isAdmin, controller.approve)

router
	.route('/reject/:id')
	.put(isAuth, isAdmin, controller.reject)

router
	.route('/ban/:id')
	.put(isAuth, isAdmin, controller.ban)

router
	.route('/unban/:id')
	.put(isAuth, isAdmin, controller.unBan)

router
	.route('/:id')
	.put(isAuth, multer({
		storage: multerStorage.userProfilePicturesStorage,
		limits: {fileSize: 1000000000}
	}).fields([
		{name: "profilePic", maxCount: 1}
	]), controller.update)
	.get(isAuth, isAdmin, controller.getOne)
	.delete(isAuth, isAdmin, controller.delete)

module.exports = router