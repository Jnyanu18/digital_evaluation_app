const app = require('../backend/app.js');
const connectToDb = require('../backend/db/db.js');

module.exports = async (req, res) => {
    await connectToDb();
    return app(req, res);
};
