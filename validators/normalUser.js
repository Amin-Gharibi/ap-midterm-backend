const yup = require("yup")

const updateUserValidator = yup.object().shape({
	id: yup
		.string()
		.required("User id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "User id is not valid"),
	email: yup
		.string()
		.nullable()
		.matches(/^[a-zA-Z].{3,}@[a-zA-Z]{4,}\.[a-zA-Z]{2,}$/, 'Entered Email is not valid!'),
	username: yup
		.string()
		.nullable()
		.matches(/^[a-zA-Z][\w]{5,}$/, 'Entered Username is not valid'),
	currentPassword: yup
		.string()
		.nullable(),
	updatingPassword: yup
		.string()
		.nullable()
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'New Password is not valid, password must contain at least 8 characters including upper and lower letters and numbers'),
	fullName: yup
		.string()
		.nullable()
		.min(4, 'Name must be longer than 4 chars')
		.max(36, 'Name must be shorter than 36 chars')
})

const idValidator = yup.object().shape({
	id: yup
		.string()
		.required("User id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "User id is not valid")
})

const changeRoleValidator = yup.object().shape({
	id: yup
		.string()
		.required("User id is required")
		.matches(/^[0-9a-fA-F]{24}$/, "User id is not valid"),
	role: yup
		.string()
		.required("Must Enter New Role!")
		.oneOf(['ADMIN', 'CRITIC', 'USER'], 'Role can be one of ADMIN, CRITIC, USER')
})


module.exports = {
	updateUserValidator,
	idValidator,
	changeRoleValidator
}