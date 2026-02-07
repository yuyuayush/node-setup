import http from 'http';
import { WebSocketServer } from "ws";
import app from './src/app.js';
import { config } from './src/config/index.js';
import logger from './src/config/logger.js';
import wsManager from './src/utils/wsManager.js';

let server;

const startServer = () => {
    try {
        server = http.createServer(app);

        // Initialize WebSocket
        const wss = new WebSocketServer({ server });
        wsManager.init(wss);

        server.listen(config.port, () => {
            logger.info(`🚀 Server running in ${config.env} mode on port ${config.port}`);
            logger.info(`🔗 API Base URL: http://localhost:${config.port}/api/v1`);
        });

    } catch (error) {
        logger.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(`Unexpected Error: ${error}`);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

startServer();
