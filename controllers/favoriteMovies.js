const favoriteMoviesModel = require("../models/favoriteMovies")
const newLiner = require("../utils/newliner")

exports.getAll = async (req, res, next) => {
	try {
		const allFavoriteMovies = await favoriteMoviesModel.find({user: req.user._id}).populate('movie').lean()

		for (const favoriteMovie of allFavoriteMovies) {
			favoriteMovie.movie.summary = newLiner(favoriteMovie.movie.summary, 50)
			favoriteMovie.movie.summary = favoriteMovie.movie.summary.slice(0, 100) + '...'
		}

		return res.status(200).json({message: "All Favorite Movies Found!", allFavoriteMovies})
	} catch (e) {
		next(e)
	}
}

exports.create = async (req, res, next) => {
	try {
		const {movie} = await favoriteMoviesModel.createValidation(req.body)

		await favoriteMoviesModel.create({movie, user: req.user._id})

		return res.status(201).json({message: "Favorite Movie Added Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {movie} = await favoriteMoviesModel.deleteValidation(req.body)

		await favoriteMoviesModel.deleteOne({movie, user: req.user._id})

		return res.status(200).json({message: "Favorite Movie Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}