import express from "express";

import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json({limit:"100kb"}));

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/players", playerRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

export default app;
