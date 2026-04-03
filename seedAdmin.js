import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/user.model.js";
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config();

/**
 * Seed Admin Script
 *
 * Purpose:
 * - Creates the first admin user in the system
 * - Ensures only ONE initial admin is created
 *
 * Why needed?
 * - Public signup does NOT allow admin role (security)
 * - So we manually bootstrap the first admin
 */
const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
        console.log("Database connected");

        const existingAdmin = await User.findOne({ role: "admin" });

        if (existingAdmin) {
            console.log("Admin already exists. Exiting...");
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = await User.create({
            name: "Super Admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully:");
        console.log({
            email: admin.email,
            role: admin.role
        });

    } catch (error) {
        console.error("Error seeding admin:", error.message);

        process.exit(1);
    }
};

seedAdmin();
