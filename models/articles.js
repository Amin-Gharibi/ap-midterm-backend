const mongoose = require("mongoose")
const {
	createValidator,
	updateValidator,
	publishValidator,
	deleteValidator,
	getOneValidator, searchValidator
} = require("../validators/articles")

const articleSchema = new mongoose.Schema({
	title: {
		type: String
	},
	body: {
		type: String
	},
	cover: {
		type: String
	},
	writer: {
		type: mongoose.Types.ObjectId,
		ref: 'NormalUsers'
	},
	isPublished: {
		type: Boolean,
		default: false
	},
	rate: {
		type: Number,
		default: 0
	}
},
	{timestamps: true})

articleSchema.statics.createValidation = function (body) {
	return createValidator.validate(body, {abortEarly: false})
}
articleSchema.statics.updateValidation = function (body) {
	return updateValidator.validate(body, {abortEarly: false})
}
articleSchema.statics.publishValidation = function (body) {
	return publishValidator.validate(body, {abortEarly: false})
}
articleSchema.statics.deleteValidation = function (body) {
	return deleteValidator.validate(body, {abortEarly: false})
}
articleSchema.statics.getOneValidation = function (body) {
	return getOneValidator.validate(body, {abortEarly: false})
}
articleSchema.statics.searchValidation = function (body) {
	return searchValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('Articles', articleSchema)

module.exports = model