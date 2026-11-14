import { Router } from "express";

import { authenticateJWT } from "../middleware/authMiddleware.js";

import {
    startSession,
    getSession,
    completeSession
} from "../controllers/sessionController.js";

import { createEvents } from "../controllers/eventController.js";

const router = Router();

router.use(authenticateJWT);


/**
 * @openapi
 * /api/sessions/start:
 *   post:
 *     summary: Start a new game session
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - difficulty
 *             properties:
 *               gameId:
 *                 type: string
 *                 example: beat_saber_basic
 *               difficulty:
 *                 type: string
 *                 example: easy
 *     responses:
 *       201:
 *         description: Game session created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/start", startSession);


/**
 * @openapi
 * /api/sessions/{id}/events:
 *   post:
 *     summary: Save gameplay events
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *             properties:
 *               events:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 100
 *                 items:
 *                   type: object
 *                   required:
 *                     - eventType
 *                   properties:
 *                     eventType:
 *                       type: string
 *                       example: object_hit
 *                     eventTime:
 *                       type: string
 *                       format: date-time
 *                     data:
 *                       type: object
 *                       additionalProperties: true
 *                       example:
 *                         hand: right
 *                         correct: true
 *                         responseTime: 1.2
 *     responses:
 *       201:
 *         description: Gameplay events saved
 *       400:
 *         description: Invalid event data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 *       409:
 *         description: Session is not active
 */
router.post("/:id/events", createEvents);


/**
 * @openapi
 * /api/sessions/{id}/complete:
 *   post:
 *     summary: Complete a session and save final analytics
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *               - analytics
 *             properties:
 *               duration:
 *                 type: number
 *                 minimum: 0
 *                 example: 300
 *               analytics:
 *                 type: object
 *                 description: Game-specific analytics
 *                 example:
 *                   score: 1500
 *                   idleTime: 25
 *                   correctSelections: 40
 *                   incorrectSelections: 5
 *                   correctStreaks: 12
 *                   handZone:
 *                     left: 20
 *                     right: 25
 *                   totalSelections: 40
 *                   totalResponseTime: 85
 *                   totalAttempts: 45
 *     responses:
 *       200:
 *         description: Session completed successfully
 *       400:
 *         description: Invalid analytics
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 *       409:
 *         description: Session already completed or abandoned
 */
router.post("/:id/complete", completeSession);


/**
 * @openapi
 * /api/sessions/{id}:
 *   get:
 *     summary: Retrieve a player's game session
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB session ObjectId
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *       400:
 *         description: Invalid session ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
 */
router.get("/:id", getSession);

export default router;
