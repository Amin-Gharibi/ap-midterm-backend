const moviesModel = require("../models/movies")
const castModel = require("../models/castUser")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose");
const commentsModel = require("../models/comments")
const favoriteMoviesModel = require("../models/favoriteMovies")
const newLiner = require("../utils/newliner")
const jwt = require("jsonwebtoken");
const normalUserModel = require("../models/normalUser");


exports.create = async (req, res, next) => {
	try {
		let {genre, ...body} = await moviesModel.createValidation(req.body)
		const medias = req.files?.medias?.map(media => media.filename) ?? undefined
		const cover = req.files?.cover[0]?.filename ?? undefined

		for (const cast of Array.from(body.cast || [])) {
			const isExist = await castModel.findById(new mongoose.Types.ObjectId(cast.castId))
			if (!isExist) {
				return res.status(400).json({message: "Cast Not Found!"})
			}
		}

		genre = genre.split(' ')

		const createdMovie = await moviesModel.create({
			...body,
			genre,
			medias,
			cover
		})
		return res.status(201).json({message: "Movie created successfully", createdMovie})
	} catch (e) {
		if (e.code && e.code === 11000) {
			return res.status(400).json({message: "A movie with this name already exists. Please choose a different name."});
		}
		next(e)
	}
}

exports.update = async (req, res, next) => {
	try {
		let {
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

		const medias = req.files?.medias?.map(media => media.filename) ?? undefined;
		const cover = req.files?.cover[0]?.filename ?? undefined

		if (medias?.length) {
			targetMovie.medias.forEach(media => {
				fs.unlink(path.join(__dirname, '../public/moviesPictures', media), err => {
					if (err) console.log(err)
				})
			})
		}

		if (cover && cover !== targetMovie.cover && targetMovie.cover !== 'default_prof_pic.png') {
			fs.unlink(path.join(__dirname, '../public/moviesPictures', targetMovie.cover), err => {
				if (err) console.log(err)
			})
		}

		genre = genre.split(' ')

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
		if (e.code && e.code === 11000) {
			return res.status(400).json({message: "A movie with this name already exists. Please choose a different name."});
		}
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

		await commentsModel.deleteMany({page: targetMovie._id})
		await favoriteMoviesModel.deleteMany({movie: targetMovie._id})

		const medias = targetMovie.medias.map(media => media) ?? undefined;
		const cover = targetMovie.cover ?? undefined;

		medias.forEach(media => {
			media && fs.unlink(path.join(__dirname, '../public/moviesPictures', media), err => {
				if (err) console.log(err)
			})
		})

		cover && fs.unlink(path.join(__dirname, '../public/moviesPictures', cover), err => {
			if (err) console.log(err)
		})

		await moviesModel.findByIdAndDelete(id)

		return res.status(200).json({message: "Movie Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.getAll = async (req, res, next) => {
	try {
		const allMovies = await moviesModel.find().lean()

		for (const movie of allMovies) {
			movie.summary = newLiner(movie.summary.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "All movies received successfully", allMovies})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await moviesModel.getOneValidation(req.params)
		const targetMovie = await moviesModel.findById(id).populate('cast.castId').lean()
		if (!targetMovie || (!targetMovie.isPublished && req.user?.role !== 'ADMIN')) {
			return res.status(404).json({message: "Movie Not Found!"})
		}

		const movieComments = await commentsModel.find({
			page: targetMovie._id,
			isApproved: true
		}).populate('user', '-password')

		targetMovie.summary = newLiner(targetMovie.summary, 200)
		targetMovie.comments = movieComments

		for (const cast of targetMovie.cast) {
			cast.cast = cast.castId
			delete cast.castId
			cast.cast.biography = newLiner(cast.cast.biography.slice(0, 200) + '...', 40)
		}

		targetMovie.isMovieInFavorites = await favoriteMoviesModel.findOne({movie: targetMovie._id})

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
			isPublished: !targetMovie.isPublished
		}, {new: true})

		return res.status(200).json({message: "Movie Status Changed Successfully!", updatedMovie})
	} catch (e) {
		n
		next(e)
	}
}

exports.getAllApproved = async (req, res, next) => {
	try {
		const approvedMovies = await moviesModel.find({isPublished: true})

		return res.status(200).json({message: "Approved Movies Found Successfully!", approvedMovies})
	} catch (e) {
		next(e)
	}
}

exports.searchHandler = async (req, res, next) => {
	try {
		const {q, filter} = await moviesModel.searchValidation(req.query)

		const authorizationHeader = req.header("Authorization")?.split(" ");
		let user = null

		if (authorizationHeader?.length === 2) {
			const token = authorizationHeader[1];

			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			user = await normalUserModel.findById(decoded.id).lean();
		}

		let targetMovies = null

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
			targetMovies = await moviesModel.find({
				$or: [
					{fullName: {$regex: q, $options: 'i'}},
					{summary: {$regex: q, $options: 'i'}}
				]
			}).sort(sortCriteria).lean()
		} else {
			targetMovies = await moviesModel.find({
				$or: [
					{fullName: {$regex: q, $options: 'i'}},
					{summary: {$regex: q, $options: 'i'}}
				],
				isPublished: true
			}).sort(sortCriteria).lean()
		}

		for (const movie of latestMovies) {
			movie.summary = newLiner(movie.summary.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Search Result Found!", result: targetMovies})
	} catch (e) {
		next(e)
	}
}

exports.getLatest = async (req, res, next) => {
	try {
		const latestMovies = await moviesModel.find({isPublished: true}).sort({createdAt: -1}).limit(8).lean();

		for (const movie of latestMovies) {
			movie.summary = newLiner(movie.summary.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Latest Movies Received Successfully!", latestMovies})
	} catch (e) {
		next(e)
	}
}

exports.getRandomGenreTopList = async (req, res, next) => {
	try {
		const allMovies = await moviesModel.find({isPublished: true}).lean();

		let genres = new Set()
		allMovies.forEach(movie => {
			if (movie.genre && Array.isArray(movie.genre)) {
				movie.genre.forEach(genre => genres.add(genre))
			}
		})
		genres = Array.from(genres)

		const randomGenre = genres[Math.floor(Math.random() * genres.length)]

		const genreTopRatedMovies = await moviesModel.find({
			isPublished: true,
			genre: randomGenre
		}).sort({rate: -1}).limit(9).lean();

		for (const movie of genreTopRatedMovies) {
			movie.summary = newLiner(movie.summary.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({
			message: "Random Genre Top Rated Movies Found!",
			genre: randomGenre,
			topMovies: genreTopRatedMovies
		})
	} catch (e) {
		next(e)
	}
}