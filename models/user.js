const mongoose = require("mongoose")
const { registerValidator, loginValidator } = require("../validators/auth")
const { updateUserValidator, approveUserValidator, deleteUserValidator, getOneUserValidator } = require("../validators/user")

const userSchema = new mongoose.Schema({
        email: {
                type: String,
                required: false
        },
        username: {
                type: String,
                required: false
        },
        password: {
                type: String,
                required: false
        },
        fullName: {
                type: String,
                default: "کاربر جدید"
        },
        pictures: {
                type: String,
                default: "default_prof_pic.png"
        },
        birthDate: {
                type: Date,
                required: false
        },
        birthCity: {
                type: String,
                required: false
        },
        role: {
                type: String,
                required: true,
                enum: ['ADMIN', 'USER', 'CRITIC', 'CAST']
        },
        movieRole: {
                type: String,
                required: false
        },
        height: {
                type: Number,
                required: false
        },
        parentsName: {
                type: String,
                required: false
        },
        isApproved: {
                type: Boolean,
                default: false
        }
})

// Auth
userSchema.statics.registerValidation = function (body) {
        return registerValidator.validate(body, { abortEarly: false })
}
userSchema.statics.loginValidation = function (body) {
        return loginValidator.validate(body, { abortEarly: false })
}

// User
userSchema.statics.updateUserValidation = function (body) {
        return updateUserValidator.validate(body, { abortEarly: false })
}
userSchema.statics.approveUserValidation = function (body) {
        return approveUserValidator.validate(body, { abortEarly: false })
}
userSchema.statics.deleteUserValidator = function (body) {
        return deleteUserValidator.validate(body, { abortEarly: false })
}
userSchema.statics.getOneUserValidator = function (body) {
        return getOneUserValidator.validate(body, { abortEarly: false })
}

const model = mongoose.model('User', userSchema)

module.exports = model