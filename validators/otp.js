const yup = require("yup")

const createValidator = yup.object().shape({
	code: yup
		.string()
		.required("otp code is required"),
	userId: yup
		.string()
		.required("user id is required")
})

module.exports = {
	createValidator
}