const http = require('http');
const app = require('./app');
const connectToDb = require('./db/db');
const port = process.env.PORT || 3000;

connectToDb().then(() => {
    const server = http.createServer(app);
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to connect to database:", err);
});