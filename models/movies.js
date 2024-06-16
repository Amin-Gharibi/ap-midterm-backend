const mongoose = require("mongoose")
const {
	createValidator,
	updateValidator,
	approveValidator,
	deleteValidator,
	getOneValidator, searchValidator
} = require("../validators/movie")

const castUserSchema = new mongoose.Schema({
	castId: {
		type: mongoose.Types.ObjectId,
		ref: 'CastUsers'
	},
	inMovieName: {
		type: String
	},
	inMovieRole: {
		type: String
	}
})

const moviesSchema = new mongoose.Schema({
	fullName: {
		type: String
	},
	summary: {
		type: String
	},
	cast: {
		type: [castUserSchema]
	},
	rate: {
		type: Number,
		default: 0
	},
	genre: {
		type: Array
	},
	releaseDate: {
		type: String
	},
	countries: {
		type: String
	},
	language: {
		type: String
	},
	budget: {
		type: Number
	},
	medias: {
		type: [String]
	},
	cover: {
		type: String
	},
	isPublished: {
		type: Boolean,
		default: false
	}
}, {timestamps: true})

moviesSchema.statics.createValidation = function (body) {
	return createValidator.validate(body, {abortEarly: false})
}
moviesSchema.statics.updateValidation = function (body) {
	return updateValidator.validate(body, {abortEarly: false})
}
moviesSchema.statics.approveValidation = function (body) {
	return approveValidator.validate(body, {abortEarly: false})
}
moviesSchema.statics.deleteValidation = function (body) {
	return deleteValidator.validate(body, {abortEarly: false})
}
moviesSchema.statics.getOneValidation = function (body) {
	return getOneValidator.validate(body, {abortEarly: false})
}
moviesSchema.statics.searchValidation = function (body) {
	return searchValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('Movies', moviesSchema)

module.exports = model