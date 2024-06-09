const yup = require("yup")

const createValidator = yup.object().shape({
	body: yup
		.string()
		.required("Entering comment body is required!"),
	page: yup
		.string()
		.required("Page ID is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Page ID is not valid"),
	pageModel: yup
		.string()
		.required("Page model is required")
		.oneOf(['Movies', 'Articles'], "Page model must be either 'Movies' or 'Articles'"),
	parentComment: yup
		.string()
		.nullable()
		.matches(/^[0-9a-fA-F]{24}$/, "Parent comment ID is not valid"),
})

const idValidator = yup.object().shape({
	id: yup
		.string()
		.required("Comment id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Comment id is not valid")
})

module.exports = {
	idValidator,
	createValidator
}