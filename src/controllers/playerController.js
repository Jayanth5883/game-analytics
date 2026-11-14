
import { z } from "zod";

import {
    getPlayerHistory,
    getPlayerAnalytics
} from "../services/playerService.js";

const historyQuerySchema = z.object({
    gameId: z.string().trim().min(1).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
});

const analyticsQuerySchema = z.object({
    gameId: z.string().trim().min(1).optional()
});

// GET player history
export const playerHistory = async (req, res, next) => {
    try {
        const query = historyQuerySchema.parse(req.query);

        const result = await getPlayerHistory(
            req.user.id,
            query
        );

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
};

// GET player analytics summary
export const playerAnalytics = async (req, res, next) => {
    try {
        const { gameId } = analyticsQuerySchema.parse(req.query);

        const analytics = await getPlayerAnalytics(
            req.user.id,
            gameId
        );

        res.status(200).json({
            success: true,
            analytics
        });
    } catch (error) {
        next(error);
    }
};
