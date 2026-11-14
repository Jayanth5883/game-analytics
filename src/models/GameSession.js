
import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
    {
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        gameId: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["active", "completed", "abandoned"],
            default: "active"
        },
        startedAt: {
            type: Date,
            default: Date.now
        },
        completedAt: {
            type: Date,
            default: null
        },
        duration: {
            type: Number,
            default: 0
        },
        analytics: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    { timestamps: true }
);

gameSessionSchema.index({ playerId: 1, startedAt: -1 });

export default mongoose.model("GameSession", gameSessionSchema);
