
import { startSessionSchema } from "../validators/sessionValidator.js";
import {
    completeSessionSchema
} from "../validators/analyticsValidator.js";

import {
    startGameSession,
    getGameSession,
     completeGameSession
} from "../services/sessionService.js";

export const startSession = async (req, res, next) => {
    try {
        const data = startSessionSchema.parse(req.body);

        const session = await startGameSession(
            req.user.id,
            data
        );

        res.status(201).json({
            success: true,
            message: "Game session started successfully",
            sessionId: session._id,
            gameId: session.gameId,
            status: session.status,
            startedAt: session.startedAt
        });
    } catch (error) {
        next(error);
    }
};

export const getSession = async (req, res, next) => {
    try {
        const session = await getGameSession(
            req.params.id,
            req.user.id
        );

        res.status(200).json({
            success: true,
            session
        });
    } catch (error) {
        next(error);
    }
};


export const completeSession = async (req, res, next) => {
    try {
        // Validate request body
        const data = completeSessionSchema.parse(req.body);

        // Complete session and save analytics
        const session = await completeGameSession(
            req.params.id,
            req.user.id,
            data
        );

        res.status(200).json({
            success: true,
            message: "Game session completed successfully",
            sessionId: session._id,
            status: session.status,
            duration: session.duration,
            analytics: session.analytics,
            completedAt: session.completedAt
        });
    } catch (error) {
        next(error);
    }
};
