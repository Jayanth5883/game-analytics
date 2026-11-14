import GameSession from "../models/GameSession.js";

// Retrieve the player's completed game sessions
export const getPlayerHistory = async (
    playerId,
    { gameId, page, limit }
) => {
    const filter = {
        playerId,
        status: "completed"
    };

    if (gameId) {
        filter.gameId = gameId;
    }

    const skip = (page - 1) * limit;

    const [sessions, total] = await Promise.all([
        GameSession.find(filter)
            .sort({ completedAt: -1, _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        GameSession.countDocuments(filter)
    ]);

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        sessions
    };
};

// Calculate the player's performance summary
export const getPlayerAnalytics = async (
    playerId,
    gameId
) => {
    const filter = {
        playerId,
        status: "completed"
    };

    if (gameId) {
        filter.gameId = gameId;
    }

    const sessions = await GameSession.find(filter)
        .select("gameId duration analytics")
        .lean();

    const totalSessions = sessions.length;

    if (totalSessions === 0) {
        return {
            totalSessions: 0,
            totalDuration: 0,
            averageScore: 0,
            highestScore: 0,
            totalSelections: 0
        };
    }

    let totalDuration = 0;
    let totalScore = 0;
    let highestScore = 0;
    let totalSelections = 0;
    let scoredSessions = 0;

    for (const session of sessions) {
        totalDuration += session.duration ?? 0;

        const score = session.analytics?.score;

        if (typeof score === "number") {
            totalScore += score;
            highestScore = Math.max(highestScore, score);
            scoredSessions++;
        }

        const hits = session.analytics?.totalSelections;

        if (typeof hits === "number") {
            totalSelections += hits;
        }
    }

    return {
        totalSessions,
        totalDuration,
        averageScore: scoredSessions
            ? Number((totalScore / scoredSessions).toFixed(2))
            : 0,
        highestScore,
        totalSelections
    };
};
