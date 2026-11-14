
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { registerUser, loginUser } from "../services/authService.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import RevokedToken from "../models/RevokedToken.js";

export const register = async (req, res, next) => {
    try {
        const data = registerSchema.parse(req.body);
        const user = await registerUser(data);

        res.status(201).json({
            success: true,
            message: "Player registered successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const data = loginSchema.parse(req.body);
        const result = await loginUser(data);

        res.status(200).json({
            success: true,
            message: "Login successful",
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];

        // Decode token to get its expiration time
        const decoded = jwt.decode(token);

        if (!decoded?.exp) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // Hash the JWT before saving it
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Save the revoked token in MongoDB
        await RevokedToken.create({
            tokenHash,
            expiresAt: new Date(decoded.exp * 1000)
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        next(error);
    }
};