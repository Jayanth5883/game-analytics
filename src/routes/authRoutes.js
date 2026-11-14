import {
    register,
    login,
    logout
} from "../controllers/authController.js";

import { authenticateJWT } from "../middleware/authMiddleware.js";
import { Router } from "express";

const router = Router();


/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new player
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: Player One
 *               email:
 *                 type: string
 *                 format: email
 *                 example: player@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: Player registered successfully
 *       400:
 *         description: Invalid registration data
 *       409:
 *         description: Email already registered
 */
router.post("/register", register);


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: player@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout and revoke the current JWT
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Missing, invalid, or expired token
 */
router.post("/logout", authenticateJWT, logout);

export default router;
