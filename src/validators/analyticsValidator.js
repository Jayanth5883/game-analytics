
import { z } from "zod";

// Reusable validation rules
const nonNegativeNumber = z.number()
    .finite()
    .nonnegative();

const nonNegativeInteger = z.number()
    .int()
    .nonnegative();

// Beat Saber analytics
const beatSaberAnalyticsSchema = z.object({
    score: nonNegativeNumber,
    idleTime: nonNegativeNumber,
    correctSelections: nonNegativeInteger,
    incorrectSelections: nonNegativeInteger,
    correctStreaks: nonNegativeInteger,

    handZone: z.object({
        left: nonNegativeInteger,
        right: nonNegativeInteger
    }).strict(),

    totalSelections: nonNegativeInteger,
    totalResponseTime: nonNegativeNumber,
    totalAttempts: nonNegativeInteger
}).strict().superRefine((data, ctx) => {
    if (
        data.correctSelections +
        data.incorrectSelections !== data.totalAttempts
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["totalAttempts"],
            message: "Total attempts must equal correct plus incorrect selections"
        });
    }

    if (data.totalSelections > data.totalAttempts) {
        ctx.addIssue({
            code: "custom",
            path: ["totalSelections"],
            message: "Total hits cannot exceed total attempts"
        });
    }
});

// Memory Game analytics
const memoryAnalyticsSchema = z.object({
    totalScore: nonNegativeNumber,
    correctSelections: nonNegativeInteger,
    incorrectSelections: nonNegativeInteger,
    averageResponseTime: nonNegativeNumber,
    recallDelay: nonNegativeNumber,
    totalAttempts: nonNegativeInteger
}).strict();

// Common request structure
export const completeSessionSchema = z.object({
    duration: nonNegativeNumber,
    analytics: z.record(
        z.string(),
        z.unknown()
    )
}).strict();

// Select validation based on the game
export const validateGameAnalytics = (
    gameId,
    analytics
) => {
    const schemas = {
        beat_saber_basic: beatSaberAnalyticsSchema,
        memory_game_01: memoryAnalyticsSchema
    };

    const schema = schemas[gameId];

    if (!schema) {
        const error = new Error(
            "Analytics schema not configured for this game"
        );
        error.statusCode = 400;
        throw error;
    }

    return schema.parse(analytics);
};
