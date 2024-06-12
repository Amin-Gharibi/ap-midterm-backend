const normalUserModel = require("../models/normalUser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const otpModel = require("../models/otp")
const emailSender = require("../utils/emailSender")

const otpEmailTemplate = code => (`
            <div>
                <h1 style="text-align: center;">IMDB M.M. OTP CODE</h1>
                <h2 style="text-align: start;">Welcome to IMDB M.M. :)</h2>
                <h3 style="text-align: center; font-weight: bold;">Here is Your OTP: ${code}</h3>
            </div>
        `)
const otpEmailSubject = 'IMDB M.M. OTP Code'

exports.initialRegister = async (req, res, next) => {
	try {
		const {email, username} = await normalUserModel.registerValidation(req.body);

		const isUserExists = await normalUserModel.findOne({$or: [{username}, {email}]});

		if (isUserExists) {
			return res.status(409).json({message: "username or email already exists"});
		}

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await otpModel.findOneAndDelete({userId: `${email}${username}`});

		await otpModel.create({code, userId: `${email}${username}`});

		try {
			await emailSender(email, otpEmailSubject, otpEmailTemplate(code));
			return res.status(200).json({message: `OTP Code Was Sent To ${email}`});
		} catch (error) {
			console.error(error);
			return res.status(500).json({message: 'Failed to send OTP'});
		}

	} catch (error) {
		next(error);
	}
};

exports.registerValidateOtp = async (req, res, next) => {
	try {
		const {code} = req.body
		const {email, username} = await normalUserModel.registerValidation(req.body)

		const isValidOtp = await otpModel.findOne({code, userId: `${email}${username}`})

		if (!isValidOtp) {
			return res.status(401).json({message: "OTP Verification Code is not Valid"})
		}

		await otpModel.deleteOne({_id: isValidOtp._id});

		return await exports.register(req, res, next)
	} catch (e) {
		next(e)
	}

}

exports.register = async (req, res, next) => {
	try {
		let {email, username, password, role, fullName} = await normalUserModel.registerValidation(req.body)

		const isUserExists = await normalUserModel.findOne({
			$or: [{username}, {email}],
		});

		if (isUserExists) {
			return res.status(409).json({
				message: "username or email already exists",
			});
		}

		const countOfRegisteredUser = await normalUserModel.countDocuments();

		const hashedPassword = await bcrypt.hash(password, 12)

		const user = await normalUserModel.create({
			fullName,
			email,
			username,
			password: hashedPassword,
			role: countOfRegisteredUser > 0 ? role : "ADMIN",
			isApproved: !countOfRegisteredUser
		});

		const userObject = user.toObject();

		Reflect.deleteProperty(userObject, "password");

		const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
			expiresIn: "5 day",
		});

		return res.status(201).json({user: userObject, accessToken, message: "Registered Successfully!"});
	} catch (e) {
		next(e)
	}
}

async function loginValidating(data) {
	const {identifier, password} = await normalUserModel.loginValidation(data);

	const user = await normalUserModel.findOne({
		$or: [{email: identifier}, {username: identifier}],
	});

	if (!user) {
		return {message: "there is no user with this email or username"};
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return {message: "password is not correct"};
	}

	return {user}
}

exports.initialLogin = async (req, res, next) => {
	try {
		const validUser = await loginValidating(req.body)

		if (validUser.message) {
			return res.status(401).json({message: validUser.message})
		}

		const code = Math.floor(100000 + Math.random() * 900000).toString();

		await otpModel.findOneAndDelete({userId: validUser.user._id});

		await otpModel.create({code, userId: validUser.user._id});

		try {
			await emailSender(validUser.user.email, otpEmailSubject, otpEmailTemplate(code));
			return res.status(200).json({message: `OTP Code Was Sent To Your Email Address`});
		} catch (error) {
			console.error(error);
			return res.status(500).json({message: 'Failed to send OTP'});
		}
	} catch (e) {
		next(e)
	}
}

exports.loginValidationOtp = async (req, res, next) => {
	try {
		const {code} = req.body
		const validUser = await loginValidating(req.body)

		if (validUser.message) {
			return res.status(401).json({message: validUser.message})
		}

		const isValidOtp = await otpModel.findOne({code, userId: validUser.user._id})

		if (!isValidOtp) {
			return res.status(401).json({message: "OTP Verification Code is not Valid"})
		}

		await otpModel.deleteOne({_id: isValidOtp._id});

		return await exports.login(req, res, next, validUser.user._id)
	} catch (e) {
		next(e)
	}
}

exports.login = async (req, res, next, userId) => {
	try {
		const accessToken = jwt.sign({id: userId}, process.env.JWT_SECRET, {
			expiresIn: "5 day"
		});

		return res.status(200).json({accessToken, message: "Logged In Successfully!"});
	} catch (e) {
		next(e)
	}
}

exports.getMe = async (req, res, next) => {
	try {
		delete req.user.password;
		req.user.profilePic = `${req.protocol}://${req.get('host')}/usersProfilePictures/${req.user.profilePic}`
		return res.status(200).json({user: req.user});
	} catch (e) {
		next(e)
	}
}