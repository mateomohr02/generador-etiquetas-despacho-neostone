require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const appRouter = require('./routes');

function createServer() {
    const app = express();

    app.use(morgan('dev'));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api', appRouter);

    return app;
}

function start(port = process.env.PORT || 3001) {
    const app = createServer();
    return new Promise((resolve) => {
        const server = app.listen(port, '127.0.0.1', () => {
            console.log(`API interna corriendo en http://127.0.0.1:${port}`);
            resolve(server);
        });
    });
}

module.exports = {
    createServer,
    start
};
