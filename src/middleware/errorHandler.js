import { ZodError } from "zod";

export const errorHandler = (error, req, res, next) => {
    // Request validation errors
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues
        });
    }

    // Duplicate MongoDB values
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: "Duplicate value"
        });
    }

    // Invalid JSON request body
    if (error instanceof SyntaxError && error.status === 400) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format"
        });
    }

    // Request body too large
    if (error.status === 413) {
        return res.status(413).json({
            success: false,
            message: "Request body too large"
        });
    }

    // Mongoose validation errors
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Database validation failed"
        });
    }

    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message: statusCode >= 500
            ? "Internal server error"
            : error.message
    });
};
