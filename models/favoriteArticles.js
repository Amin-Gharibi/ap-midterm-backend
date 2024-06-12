const mongoose = require("mongoose")
const {
	articleValidator
} = require("../validators/favoriteArticles")

const favoriteArticlesSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'NormalUsers'
	},
	article: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Articles'
	}
});


favoriteArticlesSchema.statics.createValidation = function (body) {
	return articleValidator.validate(body, {abortEarly: false})
}
favoriteArticlesSchema.statics.deleteValidation = function (body) {
	return articleValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('FavoriteArticles', favoriteArticlesSchema)

module.exports = model