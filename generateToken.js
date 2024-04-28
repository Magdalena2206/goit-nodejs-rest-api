const { v4: uuidv4 } = require('uuid');

const verificationToken = uuidv4();
console.log(verificationToken);

module.exports = { verificationToken };