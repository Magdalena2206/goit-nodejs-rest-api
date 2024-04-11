const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.URI_DB;

const db = mongoose.connect(uri, {
    dbName: 'db-contacts',
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('Database connection successful');
});

mongoose.connection.on('error', err => {
    console.log(`Mongoose connection error: ${err.message}`);
    process.exit(1);
});
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connection to DB closed');
    process.exit();
});

module.exports = db;