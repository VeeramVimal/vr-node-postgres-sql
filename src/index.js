const db = require("./config/db");
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
// const sql = require('mssql');
const pg = require('pg');
let server;

db.sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        server = app.listen(config.port, () => {
            logger.info(`Listening to port ${config.port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });


const exitHandler = async () => {
    if (server) {
        return server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        return process.exit(1);
    }
};

const unexpectedErrorHandler = async (error) => {
    console.log("error=========", error);
    logger.error(error);
    await exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});