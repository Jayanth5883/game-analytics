
import { Router } from "express";

import { authenticateJWT } from "../middleware/authMiddleware.js";

import {
    playerHistory,
    playerAnalytics
} from "../controllers/playerController.js";

const router = Router();

// Protect all player routes
router.use(authenticateJWT);


/**
 * @openapi
 * /api/players/me/history:
 *   get:
 *     summary: Retrieve logged-in player's game history
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: gameId
 *         schema:
 *           type: string
 *         example: beat_saber_basic
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Player history retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
router.get("/me/history", playerHistory);


/**
 * @openapi
 * /api/players/me/analytics:
 *   get:
 *     summary: Retrieve logged-in player's analytics summary
 *     tags:
 *       - Players
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: gameId
 *         schema:
 *           type: string
 *         example: beat_saber_basic
 *     responses:
 *       200:
 *         description: Player analytics retrieved successfully
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
router.get("/me/analytics", playerAnalytics);

export default router;
