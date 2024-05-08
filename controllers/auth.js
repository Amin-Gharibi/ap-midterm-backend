const model = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
        try {
                let { email, username, password, role } = await model.registerValidation(req.body)

                const isUserExists = await userModel.findOne({
                        $or: [{ username }, { email }],
                });

                if (isUserExists) {
                        return res.status(409).json({
                                message: "username or email already exists",
                        });
                }

                const countOfRegisteredUser = await userModel.count();

                password = await bcrypt.hash(password, 12)

                const user = await userModel.create({
                        email,
                        username,
                        password: hashedPassword,
                        role: countOfRegisteredUser > 0 ? role : "ADMIN",
                        isApproved: countOfRegisteredUser > 0 ? false : true
                });

                const userObject = user.toObject();

                Reflect.deleteProperty(userObject, "password");

                const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "5 day",
                });

                return res.status(201).json({ user: userObject, accessToken });
        } catch (e) {
                next(e)
        }
}

exports.login = async (req, res, next) => {
        try {
                const { identifier, password } = await model.loginValidation(req.body)

                const user = await userModel.findOne({
                        $or: [{ email: identifier }, { username: identifier }],
                });

                if (!user) {
                        return res
                                .status(401)
                                .json("there is no user with this email or username");
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                        return res.status(401).json({ message: "password is not correct" });
                }

                const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: "5 day",
                });

                return res.json({ accessToken });

        } catch (e) {
                next(e)
        }
}

exports.getMe = async (req, res, next) => {
        try {
                // logic will be written soon
                return res.status(200).json({message: "this api has not been completed...!"})
        } catch (e) {
                next(e)
        }
}