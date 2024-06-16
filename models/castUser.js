const mongoose = require("mongoose")
const {
	createUserValidator,
	updateUserValidator,
	deleteUserValidator,
	getOneUserValidator, searchValidator
} = require("../validators/castUser")

const castUserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: true
	},
	biography: {
		type: String
	},
	birthDate: {
		type: String
	},
	profilePic: {
		type: String,
		default: "default_prof_pic.png"
	},
	birthPlace: {
		type: String
	},
	photos: {
		type: [String]
	},
	height: {
		type: Number
	},
	rate: {
		type: Number,
		default: 0
	}
})

castUserSchema.statics.createUserValidation = function (body) {
	return createUserValidator.validate(body, {abortEarly: false})
}
castUserSchema.statics.updateUserValidation = function (body) {
	return updateUserValidator.validate(body, {abortEarly: false})
}
castUserSchema.statics.deleteUserValidation = function (body) {
	return deleteUserValidator.validate(body, {abortEarly: false})
}
castUserSchema.statics.getOneUserValidation = function (body) {
	return getOneUserValidator.validate(body, {abortEarly: false})
}
castUserSchema.statics.searchValidation = function (body) {
	return searchValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('CastUsers', castUserSchema)

module.exports = model