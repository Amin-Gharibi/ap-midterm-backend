const favoriteMoviesModel = require("../models/favoriteMovies")
const newLiner = require("../utils/newliner")
const movieModel = require("../models/movies");

exports.getAll = async (req, res, next) => {
	try {
		let allFavoriteMovies = await favoriteMoviesModel.find({user: req.user._id}).populate('movie').lean()

		allFavoriteMovies = allFavoriteMovies.filter(movie => {
			return movie.movie?.isPublished
		})

		for (const favoriteMovie of allFavoriteMovies) {
			favoriteMovie.movie.summary = newLiner(favoriteMovie.movie.summary.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "All Favorite Movies Found!", allFavoriteMovies})
	} catch (e) {
		next(e)
	}
}

exports.create = async (req, res, next) => {
	try {
		const {movie} = await favoriteMoviesModel.createValidation(req.body)

		const targetMovie = await movieModel.findById(movie)

		if (!targetMovie || !targetMovie.isPublished){
			return res.status(404).json({message: "No Movie Found"})
		}

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