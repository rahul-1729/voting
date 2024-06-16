const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL =  process.env.MONGO_URL_LOCAL // the below was not working
// const mongoURL ='mongodb+srv://rk9763981:TkUB1WngY43sW1Eu@cluster0.4i29ici.mongodb.net/hotels?retryWrites=true&w=majority'
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB database error', err);
});

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB server');
});

module.exports = db;
