
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
        url: "https://game-analytics-phs9.onrender.com",
        description: "Production Server"
    },
    {
        url: "http://localhost:3000",
        description: "Local Development Server"
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
