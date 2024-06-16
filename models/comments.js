const mongoose = require("mongoose")
const {
	createValidator,
	idValidator
} = require("../validators/comments")

const commentsSchema = new mongoose.Schema({
	body: {
		type: String
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'NormalUsers'
	},
	page: {
		type: mongoose.Schema.Types.ObjectId,
		refPath: 'pageModel'
	},
	pageModel: {
		type: String,
		required: true,
		enum: ['Movies', 'Articles', 'CastUsers']
	},
	rate: {
		type: Number,
		default: 0
	},
	likes: {
		type: [new mongoose.Schema({
			userId: {
				type: mongoose.Types.ObjectId,
				ref: 'NormalUsers'
			}
		})]
	},
	disLikes: {
		type: [new mongoose.Schema({
			userId: {
				type: mongoose.Types.ObjectId,
				ref: 'NormalUsers'
			}
		})]
	},
	isApproved: {
		type: Boolean,
		default: false
	},
	parentComment: {
		type: mongoose.Types.ObjectId,
		ref: 'Comments',
		default: null
	}
},
	{timestamps: true});


commentsSchema.statics.createValidation = function (body) {
	return createValidator.validate(body, {abortEarly: false})
}
commentsSchema.statics.approveValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
commentsSchema.statics.deleteValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
commentsSchema.statics.getOneValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
commentsSchema.statics.likeValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
commentsSchema.statics.disLikeValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}
commentsSchema.statics.getPageCommentsValidation = function (body) {
	return idValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('Comments', commentsSchema)

module.exports = model