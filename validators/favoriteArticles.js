const yup = require("yup")

const articleValidator = yup.object().shape({
	article: yup
		.string()
		.required("Article ID is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Article ID is not valid")
})

module.exports = {
	articleValidator
}