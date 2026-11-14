
import mongoose from "mongoose";
import GameSession from "../models/GameSession.js";
import GameEvent from "../models/GameEvent.js";

export const saveGameEvents = async (
    sessionId,
    playerId,
    events
) => {
    // Validate MongoDB session ID
    if (!mongoose.isValidObjectId(sessionId)) {
        const error = new Error("Invalid session ID");
        error.statusCode = 400;
        throw error;
    }

    // Verify that the session belongs to the player
    const session = await GameSession.findOne({
        _id: sessionId,
        playerId
    });

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    // Events can only be saved for active sessions
    if (session.status !== "active") {
        const error = new Error("Session is not active");
        error.statusCode = 409;
        throw error;
    }

    // Prepare event documents
    const eventDocuments = events.map((event) => ({
        sessionId: session._id,
        eventType: event.eventType,
        eventTime: event.eventTime
            ? new Date(event.eventTime)
            : new Date(),
        data: event.data
    }));

    // Save events in MongoDB
    const savedEvents = await GameEvent.insertMany(
        eventDocuments
    );

    return {
        sessionId: session._id,
        savedCount: savedEvents.length
    };
};
