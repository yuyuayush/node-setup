import logger from '../config/logger.js';

class WebSocketManager {
    constructor(server) {
        this.wss = null;
    }

    init(wss) {
        this.wss = wss;
        this.wss.on('connection', this.handleConnection.bind(this));
        logger.info('WebSocket Manager initialized');
    }

    handleConnection(socket, request) {
        const ip = request.socket.remoteAddress;
        logger.info(`WebSocket: New connection from ${ip}`);

        socket.on('message', (message) => {
            const data = message.toString();
            logger.info(`WebSocket: Received message - ${data}`);
        });

        socket.on('close', () => {
            logger.info('WebSocket: Client disconnected');
        });

        socket.on('error', (error) => {
            logger.error(`WebSocket Error: ${error.message}`);
        });
    }
}

export default new WebSocketManager();
