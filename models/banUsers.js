const mongoose = require("mongoose")

const banUsersModel = new mongoose.Schema({
	email: {
		type: String
	}
})

const model = mongoose.model('BanUsers', banUsersModel)

module.exports = model