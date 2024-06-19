const express = require("express")

const controller = require("../controllers/comments");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router
	.route('/')
	.get(isAuth, isAdmin, controller.getWaitListComments)
	.post(isAuth, controller.create)

router
	.route('/page/:id')
	.get(controller.getPageComments)

router
	.route('/me')
	.get(isAuth, controller.getMyComments)

router
	.route('/approve/:id')
	.put(isAuth, isAdmin, controller.approve)

router
	.route('/like/:id')
	.put(isAuth, controller.like)

router
	.route('/dislike/:id')
	.put(isAuth, controller.disLike)

router
	.route('/:id')
	.get(isAuth, controller.getOne)
	.delete(isAuth, controller.delete)

module.exports = router