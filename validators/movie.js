const yup = require("yup")

const createValidator = yup.object().shape({
	fullName: yup
		.string()
		.min(3, "Movie name must be longer than 3 characters")
		.max(32, "Movie name must be shorter than 32 characters")
		.required("Entering movie name is required!"),
	summary: yup
		.string()
		.min(10, "Movie summary must be longer than 10 characters")
		.max(500, "Movie summary must be shorter than 500 characters")
		.required("Entering movie summary is required"),
	cast: yup.array(yup.object().shape({
		castId: yup
			.string()
			.required("cast id is required")
			.matches(/^[0-9a-fA-F]{24}$/, "cast id is not valid"),
		inMovieRole: yup
			.string()
			.required("Entering in-movie role of each cast is required"),
		inMovieName: yup
			.string()
			.required("Entering in-movie name of each cast is required")
	})),
	genre: yup
		.string()
		.required("Entering movie genre is required"),
	releaseDate: yup
		.string()
		.matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/, 'Movie release date must be in dd/mm/yyyy format'),
	countries: yup
		.string(),
	language: yup
		.string(),
	budget: yup
		.number(),
	medias: yup.array(),
	cover: yup
		.string()
})

const updateValidator = yup.object().shape({
	id: yup
		.string()
		.required("Movie id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Movie id is not valid"),
	fullName: yup
		.string()
		.min(3, "Movie name must be longer than 3 characters")
		.max(32, "Movie name must be shorter than 32 characters"),
	summary: yup
		.string()
		.min(10, "Movie summary must be longer than 10 characters")
		.max(500, "Movie summary must be shorter than 500 characters"),
	cast: yup.array(yup.object().shape({
		castId: yup
			.string()
			.required("cast id is required")
			.matches(/^[0-9a-fA-F]{24}$/, "cast id is not valid"),
		inMovieRole: yup
			.string(),
		inMovieName: yup
			.string()
	})),
	genre: yup
		.string(),
	releaseDate: yup
		.string()
		.matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/, 'Movie release date must be in dd/mm/yyyy format'),
	countries: yup
		.string(),
	language: yup
		.string(),
	budget: yup
		.number(),
	medias: yup.array(),
	cover: yup.string()
})

const getOneValidator = yup.object().shape({
	id: yup
		.string()
		.required("Movie id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Movie id is not valid")
})

const deleteValidator = yup.object().shape({
	id: yup
		.string()
		.required("Movie id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Movie id is not valid")
})

const approveValidator = yup.object().shape({
	id: yup
		.string()
		.required("Movie id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "Movie id is not valid")
})

module.exports = {
	createValidator,
	updateValidator,
	getOneValidator,
	deleteValidator,
	approveValidator
}