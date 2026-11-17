
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

app.get("/",(req,res)=>{
    res.status(200).json({
                success: true,
        message: "Welcome to Game Analytics API",
        documentation: "https://game-analytics-phs9.onrender.com/api-docs"
    })
})

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
