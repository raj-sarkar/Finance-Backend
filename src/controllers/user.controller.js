import User from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcrypt";

/**
 * Signup Controller
 * Purpose:
 * - Create new user with hashed password
 * - Assign role (default: viewer)
 * - Issue JWT token for authentication
 */
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let assignedRole = "viewer";

        if (role) {
            if (req.user && req.user.role === "admin") {
                assignedRole = role;
            }
        }

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        });

        const token = generateToken(user._id, user.role, res);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Login Controller
 *
 * Purpose:
 * - Authenticate user using email & password
 * - Issue JWT token for protected routes
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Account is inactive. Contact admin."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = generateToken(user._id, user.role, res);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


/**
 * Update User Role
 *
 * Only Admin can:
 * - promote/demote users
 */
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId= req.params.id;

        const allowedRoles = ["viewer", "analyst", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.user.id === user._id.toString()) {
            return res.status(400).json({
                message: "You cannot change your own role"
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

/** Logout Controller
 *
 * Purpose:
 * - Clear JWT cookie to log user out
 */
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out successfully" });
    } catch (err) {
        console.log("Logout controller error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
