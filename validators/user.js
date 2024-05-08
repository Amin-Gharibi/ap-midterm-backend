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
                .min(6, 'نام کامل شما باید حداقل 6 کاراکتر باشد')
                .max(36, 'حداکثر تعداد کاراکتر نام شما 36 است'),
        pictures: yup.array(),
        birthDate: yup
                .date()
                .min(8, 'تاریخ تولد باید میلادی و با فرمت dd/mm/yyyy باشد')
                .max(8, 'تاریخ تولد باید میلادی و با فرمت dd/mm/yyyy باشد'),
        role: yup
                .string()
                .oneOf(['ADMIN', 'USER', 'CRITIC'], 'کاربر فقط میتواند یکی از گزینه های ADMIN, USER, CRITIC باشد'),
        height: yup
                .number(),
        parentsName: yup
                .string()
                .min(6, 'نام والدین باید حداقل 6 کاراکتر باشد')
                .max(64, 'حداکثر تعداد کاراکتر نام والدین 64 است')
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