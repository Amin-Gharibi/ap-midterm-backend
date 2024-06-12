const yup = require("yup")

const movieValidator = yup.object().shape({
	movie: yup
		.string()
		.required("Movie ID is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Movie ID is not valid")
})

module.exports = {
	movieValidator
}