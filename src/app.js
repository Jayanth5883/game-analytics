
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


// CORS configuration
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: "100kb" }));

app.use((req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (data) => {
        const convertDates = (value) => {
            if (value instanceof Date) {
                return value.toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata"
                });
            }

            if (Array.isArray(value)) {
                return value.map(convertDates);
            }

            if (value && typeof value === "object") {
                return Object.fromEntries(
                    Object.entries(value).map(([key, val]) => [
                        key,
                        convertDates(val)
                    ])
                );
            }

            return value;
        };

        return originalJson(convertDates(data));
    };

    next();
});

// Main Root API
app.get("/", (req, res) => {
    res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Backend Game Analytics API</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #f5f7fa;
                    font-family: Arial, sans-serif;
                }

                .container {
                    text-align: center;
                    padding: 45px 35px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
                }

                h1 {
                    margin: 0 0 28px;
                    color: #172033;
                    font-size: 28px;
                    font-weight: 600;
                }

                .button {
                    display: inline-block;
                    padding: 13px 25px;
                    background: #727782;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 7px;
                    font-size: 15px;
                    font-weight: 600;
                    transition: background 0.2s ease;
                }

                .button:hover {
                    background: #b6b7bc;
                }
            </style>
        </head>

        <body>
            <main class="container">
                <h1>Backend Game Analytics API</h1>
                <a class="button" href="/api-docs">API Documentation</a>
            </main>
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
