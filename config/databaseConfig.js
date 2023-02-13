const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/authJWT', () => {
            console.log('Db connection success');
        });
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = dbConnection;
