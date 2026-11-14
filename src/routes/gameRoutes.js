
import { Router } from "express";
import {
    listGames,
    getGame
} from "../controllers/gameController.js";

const router = Router();


/**
 * @openapi
 * /api/games:
 *   get:
 *     summary: Retrieve all active games
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: Active games retrieved successfully
 */
router.get("/", listGames);


/**
 * @openapi
 * /api/games/{gameId}:
 *   get:
 *     summary: Retrieve a game by game ID
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         example: beat_saber_basic
 *     responses:
 *       200:
 *         description: Game retrieved successfully
 *       404:
 *         description: Game not found
 */
router.get("/:gameId", getGame);

export default router;
