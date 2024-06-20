const articlesModel = require("../models/articles")
const moviesModel = require("../models/movies")
const castUserModel = require("../models/castUser")
const newLiner = require("../utils/newliner");

exports.universalSearch = async (req, res, next) => {
	try {
		const {q} = req.query
		if (!q) {
			return res.status(400).json({message: "search query not found!"})
		}

		const articles = await articlesModel.find({
			$or: [
				{title: {$regex: q, $options: 'i'}},
				{body: {$regex: q, $options: 'i'}}
			],
			isPublished: true
		}).populate("writer").limit(6).lean()

		for (const article of articles) {
			article.body = newLiner(article.body.slice(0, 200) + '...', 50)
		}

		const movies = await moviesModel.find({
			$or: [
				{fullName: {$regex: q, $options: 'i'}},
				{summary: {$regex: q, $options: 'i'}}
			],
			isPublished: true
		}).populate("cast.castId").limit(6).lean()

		for (const movie of movies) {
			movie.summary = newLiner(movie.summary.slice(0, 200) + '...', 50)
		}

		const castUsers = await castUserModel.find({
			$or: [
				{fullName: {$regex: q, $options: 'i'}}
			]
		}).limit(6).lean()

		for (const cast of castUsers) {
			cast.biography = newLiner(cast.biography.slice(0, 200) + '...', 50)
		}

		return res.status(200).json({message: "Universal Search Successful!", articles, movies, castUsers})
	} catch (e) {
		next(e)
	}
}