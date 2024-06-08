const moviesModel = require("../models/movies")
const castModel = require("../models/castUser")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose");


exports.create = async (req, res, next) => {
	try {
		const body = await moviesModel.createValidation(req.body)
		const medias = req.files.medias?.map(media => media.filename) ?? undefined
		const cover = req.files.cover?.filename ?? undefined

		for (const cast of body.cast) {
			const isExist = await castModel.findById(new mongoose.Types.ObjectId(cast.castId))
			if (!isExist) {
				return res.status(400).json({message: "Cast Not Found!"})
			}
		}

		const createdMovie = await moviesModel.create({
			...body,
			medias,
			cover
		})
		return res.status(201).json({message: "Movie created successfully", createdMovie})
	} catch (e) {
		next(e)
	}
}

exports.update = async (req, res, next) => {
	try {
		const {
			id,
			fullName,
			summary,
			cast,
			genre,
			releaseDate,
			countries,
			language,
			budget
		} = await moviesModel.updateValidation({...req.params, ...req.body})

		const targetMovie = await moviesModel.findById(id)
		if (!targetMovie) {
			return res.status(404).json({message: "Movie Not Found!"})
		}

		const medias = req.files.medias?.map(media => media.filename) ?? undefined;
		const cover = req.files.cover?.filename ?? undefined

		if (medias !== targetMovie.medias) {
			medias.forEach(media => {
				fs.unlink(path.join(__dirname, '../public/moviesPictures', media), err => {
					if (err) console.log(err)
				})
			})
		}

		if (cover !== targetMovie.cover) {
			fs.unlink(path.join(__dirname, '../public/moviesPictures', cover), err => {
				if (err) console.log(err)
			})
		}

		const updatedMovie = await moviesModel.findByIdAndUpdate(id, {
			fullName,
			summary,
			cast,
			genre,
			releaseDate,
			medias,
			countries,
			language,
			budget,
			cover
		}, {new: true})

		return res.status(201).json({message: "Movie updated successfully", updatedMovie})
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {id} = await moviesModel.deleteValidation(req.params)
		const targetMovie = await moviesModel.findById(id)
		if (!targetMovie) {
			return res.status(404).json({message: "Movie Not Found!"})
		}

		const medias = targetMovie.medias.map(media => media.filename) ?? undefined;
		const cover = targetMovie.cover?.filename ?? undefined
		console.log(medias)
		medias.forEach(media => {
			media && fs.unlink(path.join(__dirname, '../public/moviesPictures', media), err => {
				if (err) console.log(err)
			})
		})

		cover && fs.unlink(path.join(__dirname, '../public/moviesPictures', cover), err => {
			if (err) console.log(err)
		})

		await moviesModel.findByIdAndDelete(id)

		return res.status(200).json({message: "Movie Delete Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.getAll = async (req, res, next) => {
	try {
		const allMovies = await moviesModel.find().lean()

		return res.status(200).json({message: "All movies received successfully", allMovies})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await moviesModel.getOneValidation(req.params)
		const targetMovie = await moviesModel.findById(id)
		if (!targetMovie) {
			return res.status(404).json({message: "Movie Not Found!"})
		}
		return res.status(200).json({message: "target movie received successfully", targetMovie})
	} catch (e) {
		next(e)
	}
}

exports.changeStatus = async (req, res, next) => {
	try {
		const {id} = await moviesModel.approveValidation(req.params)
		const targetMovie = await moviesModel.findById(id)
		if (!targetMovie) {
			return res.status(404).json({message: "Movie Not Found!"})
		}

		const updatedMovie = await moviesModel.findByIdAndUpdate(id, {
			isApproved: !targetMovie.isApproved
		}, {new: true})

		return res.status(200).json({message: "Movie Status Changed Successfully!", updatedMovie})
	} catch (e) {
		n
		next(e)
	}
}

exports.getAllApproved = async (req, res, next) => {
	try {
		const approvedMovies = await moviesModel.find({isApproved: true})

		return res.status(200).json({message: "Approved Movies Found Successfully!", approvedMovies})
	} catch (e) {
		next(e)
	}
}

exports.searchHandler = async (req, res, next) => {
	try {
		const {q} = await moviesModel.searchValidation(req.query)

		let targetMovies = null

		if (req.user?.role === 'ADMIN') {
			targetMovies = await moviesModel.find({
				$or: [
					{ fullName: { $regex: q, $options: 'i' } },
					{ summary: { $regex: q, $options: 'i' } }
				]
			})
		} else {
			targetMovies = await moviesModel.find({
				$or: [
					{ fullName: { $regex: q, $options: 'i' } },
					{ summary: { $regex: q, $options: 'i' } }
				],
				isApproved: true
			})
		}

		return res.status(200).json({message: "Search Result Found!", result: targetMovies})
	} catch (e) {
		next(e)
	}
}