const commentsModel = require("../models/comments")

exports.create = async (req, res, next) => {
	try {
		const body = await commentsModel.createValidation(req.body)

		const createdComment = await commentsModel.create({...body})
		return res.status(201).json({message: "Comment Created Successfully!", createdComment})
	} catch (e) {
		next(e)
	}
}

exports.approve = async (req, res, next) => {
	try {
		const {id} = await commentsModel.approveValidation(req.params)
		const targetComment = await commentsModel.findById(id)
		if (!targetComment) {
			return res.status(404).json({message: "Comment Not Found!"})
		}

		const updatedComment = await commentsModel.findByIdAndUpdate(id, {isApproved: true}, {new: true})
		return res.status(201).json({message: "Comment Approved Successfully!", updatedComment})
	} catch (e) {
		next(e)
	}
}

exports.reject = async (req, res, next) => {
	try {
		const {id} = await commentsModel.rejectValidation(req.params)
		const targetComment = await commentsModel.findById(id)
		if (!targetComment) {
			return res.status(404).json({message: "Comment Not Found!"})
		}

		const updatedComment = await commentsModel.findByIdAndUpdate(id, {isApproved: false}, {new: true})
		return res.status(201).json({message: "Comment Rejected Successfully!", updatedComment})
	} catch (e) {
		next(e)
	}
}

exports.delete = async (req, res, next) => {
	try {
		const {id} = await commentsModel.deleteValidation(req.params)
		const targetComment = await commentsModel.findById(id)
		if (!targetComment) {
			return res.status(404).json({message: "Comment Not Found!"})
		}

		await commentsModel.findByIdAndDelete(id)
		return res.status(201).json({message: "Comment Deleted Successfully!"})
	} catch (e) {
		next(e)
	}
}

exports.like = async (req, res, next) => {
	try {
		const {id} = await commentsModel.likeValidation(req.params)
		const targetComment = await commentsModel.findById(id)
		if (!targetComment) {
			return res.status(404).json({message: "Comment Not Found!"})
		}

		// if already liked then don't push it again to the array
		if (targetComment.likes.find(user => user._id.equals(req.user._id))) {
			return res.status(200).json({message: "Like Saved Successfully!", updatedComment: targetComment})
		}

		let updatedDisLikes = targetComment.disLikes
		let updatedLikes = targetComment.likes

		const isUserInDislikes = targetComment.disLikes.find(user => user._id.equals(req.user._id))

		if (isUserInDislikes) {
			updatedDisLikes = updatedDisLikes.slice(isUserInDislikes, isUserInDislikes+1)
		}

		updatedLikes.push(req.user._id)

		const updatedComment = await commentsModel.findByIdAndUpdate(id,  {
			disLikes: updatedDisLikes,
			likes: updatedLikes
		}, {new: true})

		return res.status(201).json({message: "Like Saved Successfully!", updatedComment})
	} catch (e) {
		next(e)
	}
}

exports.disLike = async (req, res, next) => {
	try {
		const {id} = await commentsModel.disLikeValidation(req.params)
		const targetComment = await commentsModel.findById(id)
		if (!targetComment) {
			return res.status(404).json({message: "Comment Not Found!"})
		}

		// if already disliked then don't push it again to the array
		if (targetComment.disLikes.find(user => user._id.equals(req.user._id))) {
			return res.status(200).json({message: "DisLike Saved Successfully!", updatedComment: targetComment})
		}

		let updatedDisLikes = targetComment.disLikes
		let updatedLikes = targetComment.likes

		const isUserInLikes = targetComment.likes.find(user => user._id.equals(req.user._id))

		if (isUserInLikes) {
			updatedLikes = updatedLikes.slice(isUserInLikes, isUserInLikes+1)
		}

		updatedDisLikes.push(req.user._id)

		const updatedComment = await commentsModel.findByIdAndUpdate(id,  {
			disLikes: updatedDisLikes,
			likes: updatedLikes
		}, {new: true})

		return res.status(201).json({message: "DisLike Saved Successfully!", updatedComment})
	} catch (e) {
		next(e)
	}
}

exports.getOne = async (req, res, next) => {
	try {
		const {id} = await commentsModel.getOneValidation(req.params)
		const targetComment = await commentsModel.findById(id)
		if (!targetComment || (!targetComment.isApproved && req.user?.role !== 'ADMIN')) {
			return res.status(404).json({message: "Comment Not Found!"})
		}

		return res.status(201).json({message: "Comment Received Successfully!", targetComment})
	} catch (e) {
		next(e)
	}
}

exports.getWaitListComments = async (req, res, next) => {
	try {
		const waitListComments = await commentsModel.find({isApproved: false})

		return res.status(200).json({message: "Wait list comments received successfully!", waitListComments})
	} catch (e) {
		next(e)
	}
}