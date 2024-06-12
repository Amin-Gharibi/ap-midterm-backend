const nodemailer = require("nodemailer");

async function emailSender(email, subject, template) {
	const transporter = nodemailer.createTransport({
		service: process.env.OTP_SENDER_SERVICE,
		auth: {
			user: process.env.OTP_SENDER_EMAIL,
			pass: process.env.OTP_SENDER_PASSWORD
		}
	});

	const mailOptions = {
		from: 'gharibi8364@gmail.com',
		to: email,
		subject: subject,
		html: template
	};

	return transporter.sendMail(mailOptions);
}

module.exports = emailSender