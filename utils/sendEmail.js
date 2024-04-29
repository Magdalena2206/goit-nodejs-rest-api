const nodemailer = require('nodemailer');

const { NET_EMAIL, NET_PASSWORD, } = process.env;

const nodemailerConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: true,
    auth: {
        user: NET_EMAIL,
        pass: NET_PASSWORD,
    },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data,BASE_URL ) => {
    const email = { ...data, from: NET_EMAIL };
    const confirmationLink = `${BASE_URL}/api/auth/verify/${data.verificationToken}`;
    email.html += `<p>Click <a href="${confirmationLink}">here</a> to confirm your registration.</p>`;
  await transporter.sendMail(email);
  return true;
};

module.exports = sendEmail;
