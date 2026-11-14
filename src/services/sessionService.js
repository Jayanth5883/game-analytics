
import mongoose from "mongoose";
import Game from "../models/Game.js";
import GameSession from "../models/GameSession.js";
import {
    validateGameAnalytics
} from "../validators/analyticsValidator.js";

export const startGameSession = async (
    playerId,
    { gameId, difficulty }
) => {
    // Verify that the game exists and is active
    const game = await Game.findOne({
        gameId,
        isActive: true
    });

    if (!game) {
        const error = new Error("Game not found");
        error.statusCode = 404;
        throw error;
    }

    // Check whether the selected difficulty is supported
    if (!game.difficulties.includes(difficulty)) {
        const error = new Error("Invalid difficulty");
        error.statusCode = 400;
        throw error;
    }

    // Create the game session
    const session = await GameSession.create({
        playerId,
        gameId: game.gameId,
        module: game.module,
        difficulty,
        status: "active",
        startedAt: new Date(),
        analytics: {}
    });

    return session;
};

export const getGameSession = async (sessionId, playerId) => {
    if (!mongoose.isValidObjectId(sessionId)) {
        const error = new Error("Invalid session ID");
        error.statusCode = 400;
        throw error;
    }

    const session = await GameSession.findOne({
        _id: sessionId,
        playerId
    }).lean();

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    return session;
};


export const completeGameSession = async (
    sessionId,
    playerId,
    { duration, analytics }
) => {
    // Validate MongoDB session ID
    if (!mongoose.isValidObjectId(sessionId)) {
        const error = new Error("Invalid session ID");
        error.statusCode = 400;
        throw error;
    }

    // Find the session belonging to the player
    const session = await GameSession.findOne({
        _id: sessionId,
        playerId
    });

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    // Validate analytics for the selected game
    const validatedAnalytics = validateGameAnalytics(
        session.gameId,
        analytics
    );

    // Atomically complete only an active session
    const completedSession = await GameSession.findOneAndUpdate(
        {
            _id: sessionId,
            playerId,
            status: "active"
        },
        {
            $set: {
                status: "completed",
                completedAt: new Date(),
                duration,
                analytics: validatedAnalytics
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!completedSession) {
        const error = new Error(
            "Session is already completed or abandoned"
        );
        error.statusCode = 409;
        throw error;
    }

    return completedSession;
};
