const articlesModel = require("../models/articles")
const favoriteArticlesModel = require("../models/favoriteArticles")
const fs = require("fs")
const path = require("path")
const newLiner = require("../utils/newliner");


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

		const cover = req.files.cover[0]?.filename ?? undefined

		if (cover !== targetArticle.cover) {
			fs.unlink(path.join(__dirname, '../public/articlesCovers', cover), err => {
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
		const targetArticle = await articlesModel.findById(id)
		if (!targetArticle || (!targetArticle.isPublished && req.user?.role !== 'ADMIN')) {
			return res.status(404).json({message: "Article Not Found!"})
		}
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

		return res.status(200).json({message: "Published Articles Found Successfully!", publishedArticles})
	} catch (e) {
		next(e)
	}
}

exports.searchHandler = async (req, res, next) => {
	try {
		const {q} = await articlesModel.searchValidation(req.query)

		let targetArticles = null

		if (req.user?.role === 'ADMIN') {
			targetArticles = await articlesModel.find({
				$or: [
					{title: {$regex: q, $options: 'i'}},
					{body: {$regex: q, $options: 'i'}}
				]
			})
		} else {
			targetArticles = await articlesModel.find({
				$or: [
					{title: {$regex: q, $options: 'i'}},
					{body: {$regex: q, $options: 'i'}}
				],
				isApproved: true
			})
		}

		return res.status(200).json({message: "Search Result Found!", result: targetArticles})
	} catch (e) {
		next(e)
	}
}

exports.getMyComments = async (req, res, next) => {
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