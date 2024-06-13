const mongoose = require("mongoose")
const {
	createValidator
} = require("../validators/otp")

const otpSchema = new mongoose.Schema({
	code: {
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 180 // otp will be removed after 180 seconds
	},
	userId: {
		type: String
	}
})

otpSchema.statics.createValidation = function (body) {
	return createValidator.validate(body, {abortEarly: false})
}

const model = mongoose.model('OTP', otpSchema)

module.exports = model