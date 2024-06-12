const normalUserModel = require("../models/normalUser")
const bcrypt = require("bcrypt")
const banUsersModel = require("../models/banUsers")
const fs = require("fs")
const path = require("path")


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

		const profilePic = req.files.profilePic[0]?.filename ?? undefined

 		const targetUser = await normalUserModel.findById(id)

		if (!targetUser) {
			return res.status(404).json({message: "User Not Found!"})
		}

		if (profilePic && targetUser.profilePic !== 'default_prof_pic.png') {
			await fs.unlink(path.join(__dirname, "../public/usersProfilePictures", targetUser.profilePic), err => {
				if (err) console.log(err)
			})
		}

		let updatedUser = await normalUserModel.findByIdAndUpdate(id,  {
			email,
			username,
			fullName,
			profilePic
		}, {new: true}).select('-password')

		if (currentPassword && updatingPassword) {
			if (req.user.role !== 'ADMIN') {
				if (!bcrypt.compare(currentPassword, targetUser.password)) {
					return res.status(401).json({message: "Entered Current Password is not correct!"})
				}
			}

			updatedUser = await normalUserModel.findByIdAndUpdate(id,  {
				password: updatingPassword
			}, {new: true}).select('-password')
		}

		return res.status(200).json({message: "User Updated Successfully!", updatedUser})
	} catch (e) {
		next(e)
	}
}

exports.approve = async (req, res, next) => {
	try {
		const {id} = await normalUserModel.approveValidation(req.params)

		await normalUserModel.findByIdAndUpdate(id,  {
			isApproved: true
		})

		return res.status(200).json({message: "User Was Approved Successfully!"})
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

		await normalUserModel.findByIdAndDelete(id)

		if (targetUser.profilePic !== 'default_prof_pic.png') {
			await fs.unlink(path.join(__dirname, "../public/usersProfilePictures", targetUser.profilePic), err => {
				if (err) console.log(err)
			})
		}

		return res.status(200).json({message: "User Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.changeRole = async (req, res, next) => {
	try {
		const {id, role} = await normalUserModel.changeRoleValidation({...req.params, ...req.body})

		await normalUserModel.findByIdAndUpdate(id,  {
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
		const users = await normalUserModel.find().select('-password');

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
