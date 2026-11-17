
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Pretty-print JSON responses
app.set("json spaces", 4);

// CORS configuration
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: "100kb" }));

// Main Root API
app.get("/", (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Game Analytics API</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: #f4f6f9;
                    text-align: center;
                    padding: 50px 20px;
                }
                .container {
                    background: white;
                    max-width: 500px;
                    margin: auto;
                    padding: 30px;
                    border-radius: 12px;
                }
                h1 {
                    color: #222;
                }
                p {
                    color: #555;
                }
                a {
                    display: inline-block;
                    margin-top: 15px;
                    padding: 12px 20px;
                    background: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                }
                a:hover {
                    background: #1d4ed8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to Game Analytics API</h1>
                <a href="/api-docs">Open API Documentation</a>
            </div>
        </body>
        </html>
    `);
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/players", playerRoutes);

// Swagger documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Error handler
app.use(errorHandler);

export default app;
