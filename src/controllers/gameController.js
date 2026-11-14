
import {
    getAllGames,
    getGameById
} from "../services/gameService.js";

export const listGames = async (req, res, next) => {
    try {
        const games = await getAllGames();

        res.status(200).json({
            success: true,
            total: games.length,
            games
        });
    } catch (error) {
        next(error);
    }
};

export const getGame = async (req, res, next) => {
    try {
        const game = await getGameById(req.params.gameId);

        if (!game) {
            return res.status(404).json({
                success: false,
                message: "Game not found"
            });
        }

        res.status(200).json({
            success: true,
            game
        });
    } catch (error) {
        next(error);
    }
};
