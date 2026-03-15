const mongoose = require('mongoose');

let isConnected;

const connectToDb = async () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }

    console.log('=> using new database connection');
    const db = await mongoose.connect(process.env.DB_CONNECT);
    isConnected = db.connections[0].readyState;
};

module.exports = connectToDb;