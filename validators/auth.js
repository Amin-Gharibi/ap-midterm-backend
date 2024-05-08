const yup = require("yup")


const registerValidator = yup.object().shape({
        email: yup
                .string()
                .required("وارد کردن ایمیل الزامی است")
                .matches(/^[a-zA-Z].{3,}@[a-zA-Z]{4,}\.[a-zA-Z]{2,}$/, 'ایمیل وارد شده معتبر نیست'),
        username: yup
                .string()
                .required("وارد کردن نام کاربری الزامی است")
                .matches(/^[a-zA-Z][\w]{5,}$/, 'نام کاربری وارد شده معتبر نیست'),
        password: yup
                .string()
                .required("وارد کردن رمز عبور الزامی است")
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, 'رمز عبور معتبر نیست، رمز عبور باید حداقل 8 کاراکتر شامل حروف کوچک، بزرگ و اعداد باشد'),
        role: yup
                .string()
                .required("باید برای خود نقشی انتخاب کنید")
                .oneOf(['ADMIN', 'USER', 'CRITIC'], 'نقش شما فقط میتواند ادمین، کاربر یا منتقد باشد')
})

const loginValidator = yup.object().shape({
        identifier: yup
                .string()
                .required("وارد کردن نام کاربری یا ایمیل الزامی است"),
        password: yup
                .string()
                .required("وارد کردن رمز عبور الزامی است")
})


module.exports = {
        registerValidator,
        loginValidator
}