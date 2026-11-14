
import mongoose from "mongoose";

const gameEventSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GameSession",
            required: true
        },
        eventType: {
            type: String,
            required: true
        },
        eventTime: {
            type: Date,
            default: Date.now
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    { timestamps: true }
);

gameEventSchema.index({ sessionId: 1, eventTime: 1 });

export default mongoose.model("GameEvent", gameEventSchema);
