const nodemailer = require('nodemailer');

const { NET_EMAIL, NET_PASSWORD } = process.env;

const nodemailerConfig = {
    host: 'smtp.ethereal.email',
    port: 465,
    secure: true,
    auth: {
        user: NET_EMAIL,
        pass: NET_PASSWORD,
    },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: NET_EMAIL};
  await transport.sendMail(email);
  return true;
};

module.exports = sendEmail;
