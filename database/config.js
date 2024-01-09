const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB Online');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw new Error('Error initializing DB');
    }
};

module.exports = {
    dbConnection
};
