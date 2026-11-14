
import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "Game Analytics API",
            version: "1.0.0",
            description: "Backend APIs for Unity game analytics"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Local development server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: [
    "./src/app.js",
    "./src/routes/*.js"
]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
