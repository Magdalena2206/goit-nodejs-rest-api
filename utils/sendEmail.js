
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationToken = async (mail, token) => {
	console.log(process.env.SENDGRID_API_KEY);
	const msg = {
		to: mail,
		from: 'daria.oska@gmail.com',
		subject: 'Email verification',
		text: `Let's verify your email address`,
		html: `<strong>By clicking on the following link, you are confirming your email address <a href=${`http://localhost:3000/api/users/verify/${token}`}>VERIFY</a></strong>`,
	};
	await sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent');

		})
		.catch(error => {
			console.error(error);
		});
};

module.exports = { sendVerificationToken };




// const nodemailer = require('nodemailer');

// const { NET_EMAIL, NET_PASSWORD, } = process.env;

// const nodemailerConfig = {
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: true,
//     auth: {
//         user: NET_EMAIL,
//         pass: NET_PASSWORD,
//     },
// };

// const transporter = nodemailer.createTransport(nodemailerConfig);

// const sendEmail = async (data, BASE_URL) => {
//     console.log('NET_EMAIL:', NET_EMAIL);
//     console.log('transporter:', transporter);
//     const email = { ...data, from: NET_EMAIL };
//     const confirmationLink = `${BASE_URL}/api/auth/verify/${data.verificationToken}`;
//     email.html += `<p>Click <a href="${confirmationLink}">here</a> to confirm your registration.</p>`;
//   await transporter.sendMail(email);
//   return true;
// };

// module.exports = sendEmail;



// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.NET_EMAIL,
//     pass: process.env.NET_PASSWORD
//   }
// });

// const sendVerificationToken = async (email, token) => {
//   try {
//     const mailOptions = {
//       from: process.env.NET_EMAIL,
//       to: email,
//       subject: 'Email verification',
//       text: `Let's verify your email address`,
//       html: `<strong>By clicking on the following link, you are confirming your email address <a href=${`http://localhost:3000/api/users/verify/${token}`}>VERIFY</a></strong>`
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent');
//   } catch (error) {
//     console.error(error);
//   }
// };

// module.exports = sendVerificationToken;