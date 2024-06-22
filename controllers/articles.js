const articlesModel = require("../models/articles")
const favoriteArticlesModel = require("../models/favoriteArticles")
const fs = require("fs")
const path = require("path")
const newLiner = require("../utils/newliner");
const jwt = require("jsonwebtoken");
const normalUserModel = require("../models/normalUser");


exports.create = async (req, res, next) => {
	try {
		const body = await articlesModel.createValidation({writer: req.user._id, ...req.body})
		const cover = req.files?.cover[0]?.filename ?? undefined

		const createdArticle = await articlesModel.create({
			...body,
			cover
		})
		return res.status(201).json({message: "Article created successfully", createdArticle})
	} catch (e) {
		next(e)
	}
}

exports.update = async (req, res, next) => {
	try {
		const {
			id,
			title,
			body,
			writer
		} = await articlesModel.updateValidation({writer: req.user._id, ...req.params, ...req.body})

		const targetArticle = await articlesModel.findById(id)
		if (!targetArticle) {
			return res.status(404).json({message: "Article Not Found!"})
		}

		const cover = req.files?.cover[0]?.filename ?? undefined

		if (cover && cover !== targetArticle.cover) {
			fs.unlink(path.join(__dirname, '../public/articlesCovers', targetArticle.cover), err => {
				if (err) console.log(err)
			})
		}

		const updatedArticle = await articlesModel.findByIdAndUpdate(id, {
			title,
			body,
			writer,
			cover
		}, {new: true})

		return res.status(201).json({message: "Article updated successfully", updatedArticle})
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {id} = await articlesModel.deleteValidation(req.params)
		const targetArticle = await articlesModel.findById(id)
		if (!targetArticle) {
			return res.status(404).json({message: "Article Not Found!"})
		}

		if (req.user.role !== 'ADMIN' && !req.user._id.equals(targetArticle.writer)) {
			return res.status(401).json({message: "There is not Article For You With This ID"})
		}

		await favoriteArticlesModel.deleteMany({article: targetArticle._id})

		const cover = targetArticle.cover?.filename ?? undefined

		cover && fs.unlink(path.join(__dirname, '../public/articlesCovers', cover), err => {
			if (err) console.log(err)
		})

		await articlesModel.findByIdAndDelete(id)

		return res.status(200).json({message: "Article Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.getAll = async (req, res, next) => {
	try {
		const allArticles = await articlesModel.find().lean()

		return res.status(200).json({message: "All Articles received successfully", allArticles})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await articlesModel.getOneValidation(req.params)
		const targetArticle = await articlesModel.findById(id).populate('writer').lean()
		if (!targetArticle || (!targetArticle.isPublished && req.user?.role !== 'ADMIN')) {
			return res.status(404).json({message: "Article Not Found!"})
		}

		targetArticle.body = newLiner(targetArticle.body, 205)

		targetArticle.isArticleInFavorites = await favoriteArticlesModel.findOne({article: targetArticle._id})

		return res.status(200).json({message: "target article received successfully", targetArticle})
	} catch (e) {
		next(e)
	}
}

exports.changeStatus = async (req, res, next) => {
	try {
		const {id} = await articlesModel.publishValidation(req.params)
		const targetArticle = await articlesModel.findById(id)
		if (!targetArticle) {
			return res.status(404).json({message: "Article Not Found!"})
		}

		if (req.user.role !== 'ADMIN' && !req.user._id.equals(targetArticle.writer)) {
			return res.status(401).json({message: "There is not Article For You With This ID"})
		}

		const updatedArticle = await articlesModel.findByIdAndUpdate(id, {
			isPublished: !targetArticle.isPublished
		}, {new: true})

		return res.status(200).json({message: "Article Status Changed Successfully!", updatedArticle})
	} catch (e) {
		next(e)
	}
}

exports.getAllPublished = async (req, res, next) => {
	try {
		const publishedArticles = await articlesModel.find({isPublished: true})

		for (const article of publishedArticles) {
			article.body = newLiner(article.body.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Published Articles Found Successfully!", publishedArticles})
	} catch (e) {
		next(e)
	}
}

exports.searchHandler = async (req, res, next) => {
	try {
		const {q, filter} = await articlesModel.searchValidation(req.query)

		const authorizationHeader = req.header("Authorization")?.split(" ");
		let user = null

		if (authorizationHeader?.length === 2) {
			const token = authorizationHeader[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			user = await normalUserModel.findById(decoded.id).lean();
		}

		let targetArticles = null

		let sortCriteria = {}
		switch (filter) {
			case 'LATEST':
				sortCriteria = {createdAt: -1}
				break
			case 'TOPRATED':
				sortCriteria = {rate: -1}
				break
			case 'LOWRATED':
				sortCriteria = {rate: 1}
				break
			default:
				sortCriteria = {createdAt: 1, rate: 1}
		}

		if (user?.role === 'ADMIN') {
			targetArticles = await articlesModel.find({
				$or: [
					{title: {$regex: q, $options: 'i'}},
					{body: {$regex: q, $options: 'i'}}
				]
			}).sort(sortCriteria).lean()
		} else {
			targetArticles = await articlesModel.find({
				$or: [
					{title: {$regex: q, $options: 'i'}},
					{body: {$regex: q, $options: 'i'}}
				],
				isPublished: true
			}).sort(sortCriteria).lean()
		}

		for (const article of targetArticles) {
			article.body = newLiner(article.body.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Search Result Found!", result: targetArticles})
	} catch (e) {
		next(e)
	}
}

exports.getMyArticles = async (req, res, next) => {
	try {
		const userArticles = await articlesModel.find({writer: req.user._id})

		return res.status(200).json({message: "User Articles Received Successfully!", userArticles})
	} catch (e) {
		next(e)
	}
}

exports.getLatest = async (req, res, next) => {
	try {
		const latestArticles = await articlesModel.find({isPublished: true}).sort({createdAt: -1}).limit(9).lean();

		for (const article of latestArticles) {
			article.body = newLiner(article.body.slice(0, 200) + '...', 50)
		}

		return res.status(200).json({message: "Latest Articles Received Successfully!", latestArticles})
	} catch (e) {
		next(e)
	}
}