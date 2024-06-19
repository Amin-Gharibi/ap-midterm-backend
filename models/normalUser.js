const mongoose = require("mongoose")
const {registerValidator, loginValidator} = require("../validators/auth")
const {updateUserValidator, idValidator, changeRoleValidator, searchValidator} = require("../validators/normalUser")

const normalUserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: false
	},
	username: {
		type: String,
		required: false
	},
	password: {
		type: String,
		required: false
	},
	fullName: {
		type: String,
		default: "New User"
	},
	profilePic: {
		type: String,
		default: "default_prof_pic.png"
	},
	role: {
		type: String,
		required: true,
		enum: ['ADMIN', 'USER', 'CRITIC']
	},
	isApproved: {
		type: Boolean,
		default: false
	}
})

// Auth
normalUserSchema.statics.registerValidation = function (body) {
	return registerValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.loginValidation = function (body) {
	return loginValidator.validate(body, {abortEarly: false})
}

// User
normalUserSchema.statics.updateValidation = function (body) {
	return updateUserValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.approveValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.deleteValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.getOneValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.banValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.unBanValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
normalUserSchema.statics.searchValidation = function (body) {
	return searchValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('NormalUsers', normalUserSchema)

module.exports = model