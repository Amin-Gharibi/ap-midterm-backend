const mongoose = require("mongoose")
const {
	movieValidator
} = require("../validators/favoriteMovies")

const favoriteMoviesSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'NormalUsers'
	},
	movie: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Movies'
	}
});


favoriteMoviesSchema.statics.createValidation = function (body) {
	return movieValidator.validate(body, {abortEarly: false})
}
favoriteMoviesSchema.statics.deleteValidation = function (body) {
	return movieValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('FavoriteMovies', favoriteMoviesSchema)

module.exports = model