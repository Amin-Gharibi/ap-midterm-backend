const mongoose = require("mongoose")
const { registerValidator, loginValidator } = require("../validators/auth")
const { updateUserValidator, approveUserValidator, deleteUserValidator, getOneUserValidator } = require("../validators/normalUser")

const normalUserSchema = new mongoose.Schema({
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
        profilePic: {
                type: String,
                default: "default_prof_pic.png"
        },
        role: {
                type: String,
                required: true,
                enum: ['ADMIN', 'USER', 'CRITIC']
        },
        isApproved: {
                type: Boolean,
                default: false
        }
})

// Auth
normalUserSchema.statics.registerValidation = function (body) {
        return registerValidator.validate(body, { abortEarly: false })
}
normalUserSchema.statics.loginValidation = function (body) {
        return loginValidator.validate(body, { abortEarly: false })
}

// User
normalUserSchema.statics.updateUserValidation = function (body) {
        return updateUserValidator.validate(body, { abortEarly: false })
}
normalUserSchema.statics.approveUserValidation = function (body) {
        return approveUserValidator.validate(body, { abortEarly: false })
}
normalUserSchema.statics.deleteUserValidator = function (body) {
        return deleteUserValidator.validate(body, { abortEarly: false })
}
normalUserSchema.statics.getOneUserValidator = function (body) {
        return getOneUserValidator.validate(body, { abortEarly: false })
}

const model = mongoose.model('NormalUsers', normalUserSchema)

module.exports = model