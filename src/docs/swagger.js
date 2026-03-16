import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config/index.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node.js Express API Documentation',
            version: '1.0.0',
            description: 'A professional Node.js Express API with MongoDB and JWT authentication',
        },
        servers: [
            {
                url: `http://localhost:${config.port}/api/v1`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js', './src/models/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
