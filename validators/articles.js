const yup = require("yup")

const createValidator = yup.object().shape({
	title: yup
		.string()
		.min(3, "Article title must be longer than 3 characters")
		.max(32, "Article title must be shorter than 32 characters")
		.required("Entering article title is required!"),
	body: yup
		.string()
		.min(10, "Article body must be longer than 10 characters")
		.max(1500, "Article body must be shorter than 1500 characters")
		.required("Entering article body is required"),
	cover: yup
		.string(),
	writer: yup
		.string()
		.required("writer id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "writer id is not valid"),
	isPublished: yup
		.bool()
})

const updateValidator = yup.object().shape({
	id: yup
		.string()
		.required("Article id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Article id is not valid"),
	title: yup
		.string()
		.min(3, "Article title must be longer than 3 characters")
		.max(32, "Article title must be shorter than 32 characters"),
	body: yup
		.string()
		.min(10, "Article body must be longer than 10 characters")
		.max(1500, "Article body must be shorter than 1500 characters"),
	cover: yup
		.string(),
	writer: yup
		.string()
		.required("writer id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "writer id is not valid")
})

const getOneValidator = yup.object().shape({
	id: yup
		.string()
		.required("Article id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Article id is not valid")
})

const deleteValidator = yup.object().shape({
	id: yup
		.string()
		.required("Article id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Article id is not valid")
})

const publishValidator = yup.object().shape({
	id: yup
		.string()
		.required("Article id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Article id is not valid")
})

const searchValidator = yup.object().shape({
	q: yup
		.string(),
	filter: yup
		.string()
		.nullable()
		.oneOf(['LATEST', 'TOPRATED', 'LOWRATED'], 'Available filters are LATEST, TOPRATED, LOWRATED')
})

module.exports = {
	createValidator,
	updateValidator,
	getOneValidator,
	deleteValidator,
	publishValidator,
	searchValidator
}