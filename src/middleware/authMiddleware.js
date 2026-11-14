import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import RevokedToken from "../models/RevokedToken.js";

export const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        // Create a hash of the token
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Check whether the token has been revoked
        const revokedToken = await RevokedToken.findOne({
            tokenHash,
            expiresAt: { $gt: new Date() }
        });

        if (revokedToken) {
            return res.status(401).json({
                success: false,
                message: "Token has been revoked. Please login again."
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        req.user = {
            id: user._id.toString()
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};