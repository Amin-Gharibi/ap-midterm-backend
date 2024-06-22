const castUserModel = require("../models/castUser")
const fs = require("fs")
const path = require("path")
const moviesModel = require("../models/movies");
const commentsModel = require("../models/comments");
const newLiner = require("../utils/newliner");


exports.create = async (req, res, next) => {
	try {
		const body = await castUserModel.createUserValidation(req.body)
		const profilePic = req.files?.profilePic ? req.files.profilePic[0].filename : undefined;
		const photos = req.files?.photos ? req.files.photos.map(file => file.filename) : [];
		const castUser = await castUserModel.create({
			...body,
			profilePic,
			photos
		})
		return res.status(201).json({message: "Cast created successfully", castUser})
	} catch (e) {
		next(e)
	}
}

exports.update = async (req, res, next) => {
	try {
		const {
			id,
			fullName,
			biography,
			birthDate,
			birthPlace,
			height,
		} = await castUserModel.updateUserValidation({...req.params, ...req.body})

		const castUser = await castUserModel.findById(id);

		if (!castUser) {
			return res.status(404).json({error: 'Cast Not Found!'});
		}

		const photos = req.files?.photos?.map(photo => photo.filename) ?? undefined;
		const profilePic = req.files?.profilePic ? req.files.profilePic[0]?.filename : undefined;

		// delete old files
		if (profilePic && profilePic !== castUser.profilePic && castUser.profilePic !== 'default_prof_pic.png') {
			fs.unlink(path.join(__dirname, '../public/moviesPictures', castUser.profilePic), err => {
				if (err) console.log(err);
			})
		}

		if (photos?.length) {
			castUser.photos.forEach(photo => {
				fs.unlink(path.join(__dirname, '../public/moviesPictures', photo), err => {
					if (err) console.log(err);
				})
			})
		}

		const updatedCast = await castUserModel.findByIdAndUpdate(id, {
			fullName: fullName ?? undefined,
			biography: biography ?? undefined,
			birthDate: birthDate ?? undefined,
			birthPlace: birthPlace ?? undefined,
			profilePic,
			photos,
			height: height ?? undefined
		}, {new: true})

		return res.status(200).json({message: "Cast updated successfully", updatedCast});
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {id} = await castUserModel.deleteUserValidation(req.params)
		const targetCast = await castUserModel.findById(id)

		if (!targetCast) {
			return res.status(404).json({message: "Cast Not Found!"})
		}

		// remove cast name from all movies he has acted in
		await moviesModel.updateMany(
			{"cast.castId": targetCast._id},
			{$pull: {cast: {castId: targetCast._id}}}
		)

		// remove all comments of his page
		await commentsModel.deleteMany({page: targetCast._id})

		// delete cast related files
		if (targetCast.profilePic && targetCast.profilePic !== 'default_prof_pic.png') {
			fs.unlink(path.join(__dirname, '../public/moviesPictures', targetCast.profilePic), err => {
				if (err) console.log(err);
			});
		}

		// delete cast related files
		if (targetCast.photos.length > 0) {
			targetCast.photos.forEach(photo => {
				fs.unlink(path.join(__dirname, '../public/moviesPictures', photo), err => {
					if (err) console.log(err);
				});
			});
		}

		await castUserModel.findByIdAndDelete(id)

		return res.status(200).json({message: "Cast deleted successfully"})
	} catch (e) {
		next(e)
	}
}

exports.getAll = async (req, res, next) => {
	try {
		const allCast = await castUserModel.find().lean()

		for (const cast of allCast) {
			cast.biography = newLiner(cast.biography.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "All cast received successfully", allCast})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await castUserModel.getOneUserValidation(req.params)
		const targetCast = await castUserModel.findById(id).lean();
		if (!targetCast) {
			return res.status(404).json({message: "Cast Not Found!"})
		}

		targetCast.biography = newLiner(targetCast.biography, 200)

		return res.status(200).json({message: "Target cast received successfully", targetCast})
	} catch (e) {
		next(e)
	}
}

exports.searchHandler = async (req, res, next) => {
	try {
		const {q, filter} = await castUserModel.searchValidation(req.query)

		let targetCasts = null

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

		targetCasts = await castUserModel.find({
			$or: [
				{fullName: {$regex: q, $options: 'i'}}
			]
		}).sort(sortCriteria).lean()

		for (const cast of targetCasts) {
			cast.biography = newLiner(cast.biography.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Search Result Found!", result: targetCasts})
	} catch (e) {
		next(e)
	}
}

exports.getTopRated = async (req, res, next) => {
	try {
		const topRated = await castUserModel.find().sort({rate: -1}).limit(4).lean()

		for (const cast of topRated) {
			cast.biography = newLiner(cast.biography.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Top Rated Artists Found!", topRated})
	} catch (e) {
		next(e)
	}
}

exports.getCastMovies = async (req, res, next) => {
	try {
		const {id} = await castUserModel.getOneUserValidation(req.params)

		const castMovies = await moviesModel.find(
			{
				"cast.castId": id,
				isPublished: true
			}
		)

		for (const movie of castMovies) {
			movie.summary = newLiner(movie.summary.slice(0, 200) + '...', 40)
		}

		return res.status(200).json({message: "Cast Movies Received Successfully!", castMovies})
	} catch (e) {
		next(e)
	}
}