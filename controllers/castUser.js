const castUserModel = require("../models/castUser")
const fs = require("fs")
const path = require("path")

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

		const profilePicPath = req.files?.profilePic ? req.files.profilePic[0].filename : castUser.profilePic;
		const photoPaths = req.files?.photos ? req.files.photos.map(file => file.filename) : castUser.photos;

		// delete old files
		if (req.files?.profilePic && castUser.profilePic !== 'default_prof_pic.png') {
			fs.unlink(path.join(__dirname, '../public/moviesPictures', castUser.profilePic), err => {
				if (err) console.log(err);
			});
		}

		if (req.files?.photos && castUser.photos.length > 0) {
			castUser.photos.forEach(photo => {
				fs.unlink(path.join(__dirname, '../public/moviesPictures', photo), err => {
					if (err) console.log(err);
				});
			});
		}

		const updatedCast = await castUserModel.findByIdAndUpdate(id,  {
			fullName,
			biography,
			birthDate,
			birthPlace,
			profilePic: profilePicPath,
			photos: photoPaths,
			height
		}, {new: true})

		return res.status(200).json({message: "Cast updated successfully", updatedCast});
	} catch (e) {
		next(e)
	}
}
;

exports.delete = async (req, res, next) => {
	try {
		const {id} = await castUserModel.deleteUserValidation(req.params)
		const targetCast = await castUserModel.findById(id)

		if (!targetCast) {
			return res.status(404).json({message: "Cast Not Found!"})
		}

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

		return res.status(200).json({message: "All cast received successfully", allCast})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await castUserModel.getOneUserValidation(req.params)
		const targetCast = await castUserModel.findById(id)

		return res.status(200).json({message: "Target cast received successfully", targetCast})
	} catch (e) {
		next(e)
	}
}