const yup = require("yup")


const registerValidator = yup.object().shape({
        fullName: yup
            .string()
            .required("Entering Your Full Name Is Required!")
            .min(4, 'Full Name Must Be Longer Than 4 Characters')
            .max(36, 'Full Name Must Be Shorter Than 36 Characters'),
        email: yup
                .string()
                .required("Entering Your Email Address Is Required!")
                .matches(/^[a-zA-Z].{3,}@[a-zA-Z]{4,}\.[a-zA-Z]{2,}$/, 'Entered Email Address Is Not Valid'),
        username: yup
                .string()
                .required("Entering Username Is Required!")
                .matches(/^[a-zA-Z]\w{5,}$/, 'Entered Username Is Not Valid!'),
        password: yup
                .string()
                .required("Entering Password Is Required")
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'Entered Password Is Not Valid! Password must be longer than 8 characters and must include Upper and Lowercase letters and numbers'),
        role: yup
                .string()
                .required("You Need To Choose A Role For Yourself In This Platform")
                .oneOf(['USER', 'CRITIC'], 'Available Roles Are: User, Critic')
})

const loginValidator = yup.object().shape({
        identifier: yup
                .string()
                .required("Entering Email Or Username Is Required"),
        password: yup
                .string()
                .required("Entering Password Is Required")
})


module.exports = {
        registerValidator,
        loginValidator
}