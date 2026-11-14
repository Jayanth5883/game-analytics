
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
    {
        gameId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        module: {
            type: String,
            required: true
        },
        difficulties: {
            type: [String],
            default: ["easy", "medium", "hard"]
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
