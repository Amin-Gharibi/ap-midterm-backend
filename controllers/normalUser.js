const normalUserModel = require("../models/normalUser")
const bcrypt = require("bcrypt")
const banUsersModel = require("../models/banUsers")
const fs = require("fs")
const path = require("path")
const emailSender = require("../utils/emailSender")
const articlesModel = require("../models/articles")
const commentsModel = require("../models/comments")
const favoriteArticlesModel = require("../models/favoriteArticles")
const favoriteMoviesModel = require("../models/favoriteMovies")
const castUserModel = require("../models/castUser")
const moviesModel = require("../models/movies")


const approveEmailSubject = 'Congratulations! You Are Now In IMDB M.M.'
const approveEmailTemplate = (fullName) => (`
<div>
	<h1 style="text-align: center;">Congratulations Dear ${fullName}</h1>
	<p style="text-align: start;">Dear ${fullName}, Your Account has been approved by the administration, and now you can easily log-in to your account using the credentials you entered while signing up!</p>
	<h5 style="text-align: start;">Feel free to share your thoughts with administration :) ❤️</h5>
	<h4 style="text-align: center;">IMDB M.M.</h4>
</div>
`)
const rejectEmailSubject = "Sorry! Buy You Couldn't Make It To IMDB M.M."
const rejectEmailTemplate = (fullName) => (`
<div>
	<h1 style="text-align: center;">Sorry Dear ${fullName}</h1>
	<p style="text-align: start;">Dear ${fullName}, Your Account Wasn't Qualified To Make It To IMDB M.M.! You Can Try Again If You Think There Has Been A Mistake.</p>
	<h5 style="text-align: start;">Feel free to share your thoughts with administration! ❤️</h5>
	<h4 style="text-align: center;">IMDB M.M.</h4>
</div>
`)

exports.update = async (req, res, next) => {
	try {
		const {
			id,
			email,
			username,
			fullName,
			currentPassword,
			updatingPassword
		} = await normalUserModel.updateValidation({...req.body, ...req.params})

		const profilePic = req.files?.profilePic[0]?.filename ?? undefined

		const targetUser = await normalUserModel.findById(id)

		if (!targetUser) {
			return res.status(404).json({message: "User Not Found!"})
		}

		if (profilePic && targetUser.profilePic !== 'default_prof_pic.png') {
			await fs.unlink(path.join(__dirname, "../public/usersProfilePictures", targetUser.profilePic), err => {
				if (err) console.log(err)
			})
		}

		let updatedUser = await normalUserModel.findByIdAndUpdate(id, {
			email: email ?? undefined,
			username: username ?? undefined,
			fullName: fullName ?? undefined,
			profilePic: profilePic ?? undefined
		}, {new: true}).select('-password')

		if (currentPassword && updatingPassword) {
			if (req.user.role !== 'ADMIN' && !req.user._id.equals(id)) {
				return res.status(401).json({message: "You Are Not Authorized!"})
			} else if (req.user.role !== 'ADMIN' && req.user._id.equals(id)) {
				if (!(await bcrypt.compare(currentPassword, targetUser.password))) {
					return res.status(401).json({message: "Entered Current Password is not correct!"})
				}
			}

			updatedUser = await normalUserModel.findByIdAndUpdate(id, {
				password: await bcrypt.hash(updatingPassword, 12)
			}, {new: true}).select('-password')
		}

		updatedUser.profilePic = `${req.protocol}://${req.get('host')}/usersProfilePictures/${updatedUser.profilePic}`

		return res.status(200).json({message: "Details Updated Successfully!", updatedUser})
	} catch (e) {
		next(e)
	}
}

exports.approve = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.approveValidation(req.params)

		const user = await normalUserModel.findByIdAndUpdate(id, {
			isApproved: true
		}, {new: true})

		await emailSender(user.email, approveEmailSubject, approveEmailTemplate(user.fullName))

		return res.status(200).json({message: "User Was Approved Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.reject = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.approveValidation(req.params)

		const user = await normalUserModel.findByIdAndDelete(id)

		await emailSender(user.email, rejectEmailSubject, rejectEmailTemplate(user.fullName))

		return res.status(200).json({message: "User Was Rejected Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.deleteValidation(req.params)

		const targetUser = await normalUserModel.findById(id)

		if (!targetUser) {
			return res.status(404).json({message: "User Not Found!"})
		}

		const userComments = await commentsModel.find({user: id})
		for (const comment of userComments) {
			const targetPage = (await articlesModel.findById(comment.page)) || (await castUserModel.findById(comment.page)) || (await moviesModel.findById(comment.page))
			const targetPageCommentsCounts = Array.from((await commentsModel.find({page: comment.page, parentComment: null}))).length
			if (targetUser.role === 'CRITIC') {
				targetPage.rate = (targetPage.rate * targetPageCommentsCounts - (2 * comment.rate)) / (targetPageCommentsCounts - 1)
			} else {
				targetPage.rate = (targetPage.rate * targetPageCommentsCounts - comment.rate) / (targetPageCommentsCounts - 1)
			}
			targetPage.save()
			await commentsModel.findByIdAndDelete(comment._id)
		}

		if (targetUser.profilePic !== 'default_prof_pic.png') {
			await fs.unlink(path.join(__dirname, "../public/usersProfilePictures", targetUser.profilePic), err => {
				if (err) console.log(err)
			})
		}

		await articlesModel.deleteMany({writer: id})
		await favoriteArticlesModel.deleteMany({user: id})
		await favoriteMoviesModel.deleteMany({user: id})
		await normalUserModel.findByIdAndDelete(id)

		return res.status(200).json({message: "User Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.changeRole = async (req, res, next) => {
	try {
		const {id, role} = await normalUserModel.changeRoleValidation({...req.params, ...req.body})

		await normalUserModel.findByIdAndUpdate(id, {
			role
		})

		return res.status(200).json({message: "User Role Updated Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.ban = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.banValidation(req.params)

		const targetUser = await normalUserModel.findById(id)

		await banUsersModel.create({
			email: targetUser.email
		})

		return res.status(200).json({message: "Target User Banned Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.unBan = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.unBanValidation(req.params)

		const targetUser = await normalUserModel.findById(id)

		await banUsersModel.findOneAndDelete({
			email: targetUser.email
		})

		return res.status(200).json({message: "User UnBanned Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.getAll = async (req, res, next) => {
	try {
		const users = await normalUserModel.find({isApproved: true}).select('-password').lean();

		for (const user of users) {
			user.isBanned = !!(await banUsersModel.findOne({email: user.email}))
		}

		return res.status(200).json({message: "Users Found Successfully!", users})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.getOneValidation(req.params)

		const user = await normalUserModel.findById(id).select('-password')

		return res.status(200).json({message: "User Was Found Successfully!", user})
	} catch (e) {
		next(e)
	}
}

exports.getWaitList = async (req, res, next) => {
	try {
		const approvedUsers = await normalUserModel.find({isApproved: false}, '-password').lean()

		const waitListUsers = [];
		for (const user of approvedUsers) {
			const isUserBanned = await banUsersModel.findOne({email: user.email});
			if (!isUserBanned) {
				waitListUsers.push(user);
			}
		}

		return res.status(200).json({message: "WaitList users received successfully!", waitListUsers})
	} catch (e) {
		next(e)
	}
}

exports.search = async (req, res, next) => {
	try {
		const {q} = await normalUserModel.searchValidation(req.query)

		let targetUsers = null

		targetUsers = await normalUserModel.find({
			$or: [
				{ fullName: { $regex: q, $options: 'i' } },
				{ email: { $regex: q, $options: 'i' } },
				{ username: { $regex: q, $options: 'i' } }
			]
		}, '-password').lean()

		for (const user of targetUsers) {
			user.isBanned = !!(await banUsersModel.findOne({email: user.email}))
		}

		return res.status(200).json({message: "Search Result Found!", result: targetUsers})
	} catch (e) {
		next(e)
	}
}
