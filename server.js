import http from 'http';
import { WebSocketServer } from "ws";
import app from './src/app.js';
import { config } from './src/config/index.js';
import logger from './src/config/logger.js';
import wsManager from './src/utils/wsManager.js';

const startServer = () => {
    try {
        const server = http.createServer(app);

        // Initialize WebSocket
        const wss = new WebSocketServer({ server });
        wsManager.init(wss);

        server.listen(config.port, () => {
            logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
            logger.info(`🔗 API Base URL: http://localhost:${config.port}/api/v1`);
        });

        // Handle Unhandled Rejections
        process.on('unhandledRejection', (err) => {
            logger.error(`Unhandled Rejection: ${err.message}`);
            server.close(() => process.exit(1));
        });

    } catch (error) {
        logger.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
