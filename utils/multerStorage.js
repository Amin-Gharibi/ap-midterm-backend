const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

module.exports.userPicturesStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '..', 'public', 'usersPictures'));
	},
	filename: (req, file, cb) => {
		const sha256 = crypto.createHash('SHA256');
		const hashedFileName = sha256.update(file.originalname).digest('hex');
		cb(null, hashedFileName + path.extname(file.originalname));
	},
})

module.exports.moviesPicturesStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '..', 'public', 'moviesPictures'));
	},
	filename: (req, file, cb) => {
		const sha256 = crypto.createHash('SHA256');
		const hashedFileName = sha256.update(file.originalname).digest('hex');
		cb(null, hashedFileName + path.extname(file.originalname));
	},
})

module.exports.articlesCoversStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '..', 'public', 'articlesCover'));
	},
	filename: (req, file, cb) => {
		const sha256 = crypto.createHash('SHA256');
		const hashedFileName = sha256.update(file.originalname).digest('hex');
		cb(null, hashedFileName + path.extname(file.originalname));
	},
})