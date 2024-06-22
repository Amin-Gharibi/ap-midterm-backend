const favoriteArticlesModel = require("../models/favoriteArticles")
const articleModel = require("../models/articles")
const newLiner = require("../utils/newliner");

exports.getAll = async (req, res, next) => {
	try {
		let allFavoriteArticles = await favoriteArticlesModel.find({user: req.user._id}).populate('article').lean()

		allFavoriteArticles = allFavoriteArticles.filter(article => {
			return article.article.isPublished
		})

		for (const favoriteArticle of allFavoriteArticles) {
			favoriteArticle.article.body = newLiner(favoriteArticle.article.body.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "All Favorite Articles Found!", allFavoriteArticles})
	} catch (e) {
		next(e)
	}
}

exports.create = async (req, res, next) => {
	try {
		const {article} = await favoriteArticlesModel.createValidation(req.body)

		const targetArticle = await articleModel.findById(article)

		if (!targetArticle || !targetArticle.isPublished) {
			return res.status(404).json({message: "No Article Found"})
		}

		await favoriteArticlesModel.create({article, user: req.user._id})

		return res.status(201).json({message: "Favorite Article Added Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {article} = await favoriteArticlesModel.deleteValidation(req.body)

		await favoriteArticlesModel.deleteOne({article, user: req.user._id})

		return res.status(200).json({message: "Favorite Article Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}