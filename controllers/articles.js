const articlesModel = require("../models/articles")
const fs = require("fs")
const path = require("path")


exports.create = async (req, res, next) => {
	try {
		const body = await articlesModel.createValidation({writer: req.user._id, ...req.body})
		const cover = req.files.cover[0]?.filename ?? undefined

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
		if (!targetArticle || (!targetArticle.isApproved && req.user?.role !== 'ADMIN')) {
			return res.status(404).json({message: "Article Not Found!"})
		}
		return res.status(200).json({message: "target article received successfully", targetArticle})
	} catch (e) {
		next(e)
	}
}

exports.changeStatus = async (req, res, next) => {
	try {
		const {id} = await articlesModel.approveValidation(req.params)
		const targetArticle = await articlesModel.findById(id)
		if (!targetArticle) {
			return res.status(404).json({message: "Article Not Found!"})
		}

		const updatedArticle = await articlesModel.findByIdAndUpdate(id, {
			isApproved: !targetArticle.isApproved
		}, {new: true})

		return res.status(200).json({message: "Article Status Changed Successfully!", updatedArticle})
	} catch (e) {
		n
		next(e)
	}
}

exports.getAllApproved = async (req, res, next) => {
	try {
		const approvedArticles = await articlesModel.find({isApproved: true})

		return res.status(200).json({message: "Approved Articles Found Successfully!", approvedArticles})
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