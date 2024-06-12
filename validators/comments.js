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
		.oneOf(['Movies', 'Articles', 'CastUsers'], "Page model must be either 'Movies' or 'Articles' or 'CastUsers'"),
	parentComment: yup
		.string()
		.nullable()
		.matches(/^[0-9a-fA-F]{24}$/, "Parent comment ID is not valid"),
	rate: yup
		.number()
		.nullable()
		.min(0, 'Rate Can Not Be Less Than 0')
		.max(10, 'Rate Can Not Be Greater Than 10')
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