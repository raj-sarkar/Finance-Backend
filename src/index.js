import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/connectDB.js';
import userRoutes from './routes/user.routes.js';
import recordRoutes from './routes/record.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"]);

dotenv.config();
connectDB();

const app=express();
const port=process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
