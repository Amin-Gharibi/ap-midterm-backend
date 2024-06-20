const yup = require("yup")

const createUserValidator = yup.object().shape({
	fullName: yup
		.string()
		.min(6, 'Min character count for cast name is 6')
		.max(36, 'Max character count for cast name is 36')
		.required("Entering full name is required!"),
	biography: yup
		.string()
		.min(10, 'Min character count for biography is 10')
		.max(150, 'Max character count for biography is 150')
		.required("Entering biography is required!"),
	birthDate: yup
		.string()
		.matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/, 'Birth date must match dd/mm/yyyy'),
	birthPlace: yup
		.string(),
	profilePic: yup
		.string(),
	photos: yup
		.array(),
	height: yup
		.string()
})

const updateUserValidator = yup.object().shape({
	id: yup
		.string()
		.required("cast id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "cast id is not valid"),
	fullName: yup
		.string()
		.nullable()
		.min(6, 'Min character count for cast name is 6')
		.max(36, 'Max character count for cast name is 36'),
	biography: yup
		.string()
		.nullable(),
	birthDate: yup
		.string()
		.nullable()
		.matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/, 'Birth date must match dd/mm/yyyy'),
	birthPlace: yup
		.string()
		.nullable(),
	profilePic: yup.string().nullable(),
	photos: yup.array().nullable(),
	height: yup.number().nullable(),
})

const deleteUserValidator = yup.object().shape({
	id: yup
		.string()
		.required("cast id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "cast id is not valid")
})

const getOneUserValidator = yup.object().shape({
	id: yup
		.string()
		.required("cast id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "cast id is not valid")
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
	createUserValidator,
	updateUserValidator,
	deleteUserValidator,
	getOneUserValidator,
	searchValidator
}