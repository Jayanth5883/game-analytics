
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async ({ username, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email: normalizedEmail,
        password: hashedPassword
    });

    return {
        id: user._id,
        username: user.username,
        email: user.email
    };
};

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({
        email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user._id.toString()
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return {
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    };
};

