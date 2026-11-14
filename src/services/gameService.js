
import Game from "../models/Game.js";

// Retrieve all active games
export const getAllGames = async () => {
    return await Game.find({ isActive: true })
        .select("gameId name module difficulties")
        .sort({ name: 1 })
        .lean();
};

// Retrieve a specific game
export const getGameById = async (gameId) => {
    return await Game.findOne({
        gameId,
        isActive: true
    }).lean();
};
