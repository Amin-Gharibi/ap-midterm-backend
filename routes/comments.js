const express = require("express")

const controller = require("../controllers/comments");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router
	.route('/')
	.get(isAuth, isAdmin, controller.getWaitListComments)
	.post(isAuth, isAdmin, controller.create)

router
	.route('/approve/:id')
	.put(isAuth, isAdmin, controller.approve)

router
	.route('/reject/:id')
	.put(isAuth, isAdmin, controller.reject)

router
	.route('/like/:id')
	.put(isAuth, controller.like)

router
	.route('/dislike/:id')
	.put(isAuth, controller.disLike)

router
	.route('/:id')
	.get(isAuth, controller.getOne)
	.delete(isAuth, isAdmin, controller.delete)

module.exports = router