const jwt = require("jsonwebtoken");
const normalUserModel = require("../models/normalUser");
const banUsersModel = require("../models/banUsers")

module.exports = async (req, res, next) => {
	const authorizationHeader = req.header("Authorization")?.split(" ");

	if (authorizationHeader?.length !== 2) {
		return res.status(403).json({
			message: "this route is protected and you can't have access to it.",
		});
	}

	const token = authorizationHeader[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await normalUserModel.findById(decoded.id).lean();
		if (!user) {
			return res.status(404).json({message: "User Not Found"});
		}
		if (!user.isApproved) {
			return res.status(401).json({message: "Your Account Hasn't Been Approved Yet! Please Try Again Later!"})
		}
		Reflect.deleteProperty(user, "password");

		req.user = user;

		const isBanned = await banUsersModel.findOne({email: user.email})
		if (isBanned) {
			return res.status(401).json({message: "You Have Been Banned! Please Contact Administration!"})
		}

		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			error.message = "توکن منقضی شده است";
			error.statusCode = 401;
		} else if (error instanceof jwt.JsonWebTokenError) {
			error.message = "توکن نامعتبر است";
			error.statusCode = 401;
		} else {
			error.message = "Unexpected error";
			error.statusCode = 500;
		}
		next(error);
	}
};
