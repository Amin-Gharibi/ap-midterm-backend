const yup = require("yup")

const updateUserValidator = yup.object().shape({
        email: yup
                .string()
                .matches(/^[a-zA-Z].{3,}@[a-zA-Z]{4,}\.[a-zA-Z]{2,}$/, 'ایمیل وارد شده معتبر نیست'),
        username: yup
                .string()
                .matches(/^[a-zA-Z][\w]{5,}$/, 'نام کاربری وارد شده معتبر نیست'),
        password: yup
                .string()
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'رمز عبور معتبر نیست، رمز عبور باید حداقل 8 کاراکتر شامل حروف کوچک، بزرگ و اعداد باشد'),
        fullName: yup
                .string()
                .min(4, 'نام کامل شما باید حداقل 4 کاراکتر باشد')
                .max(36, 'حداکثر تعداد کاراکتر نام شما 36 است'),
        profilePic: yup.string(),
        role: yup
                .string()
                .oneOf(['ADMIN', 'USER', 'CRITIC'], 'کاربر فقط میتواند یکی از گزینه های ADMIN, USER, CRITIC باشد')
})

const approveUserValidator = yup.object().shape({
        id: yup
                .string()
                .required("شناسه کاربر الزامی است")
                .matches(/^[0-9a-fA-F]{24}$/, "شناسه معتبر نیست")
})

const deleteUserValidator = yup.object().shape({
        id: yup
                .string()
                .required("شناسه کاربر الزامی است")
                .matches(/^[0-9a-fA-F]{24}$/, "شناسه معتبر نیست")
})

const getOneUserValidator = yup.object().shape({
        id: yup
                .string()
                .required("شناسه کاربر الزامی است")
                .matches(/^[0-9a-fA-F]{24}$/, "شناسه معتبر نیست")
})


module.exports = {
        updateUserValidator,
        approveUserValidator,
        deleteUserValidator,
        getOneUserValidator
}