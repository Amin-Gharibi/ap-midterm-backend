const moviesModel = require("../models/movies")
const fs = require("fs")
const path = require("path")


exports.create = async (req, res, next) => {
	try {
		const body = await moviesModel.createValidation(req.body)
		const medias = req.files.medias?.map(media => media.filename) ?? undefined
		const cover = req.files.cover?.filename ?? undefined
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

		const updatedMovie = await moviesModel.findByIdAndUpdate(id,  {
			isApproved: !targetMovie.isApproved
		}, {new: true})

		return res.status(200).json({message: "Movie Status Changed Successfully!", updatedMovie})
	} catch (e) {n
		next(e)
	}
}