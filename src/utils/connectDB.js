import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connect = await mongoose.connect(
            process.env.MONGODB_CONNECTION_STRING
        );
        console.log(
            "Connected to data base",
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.log("Error while connecting to data base", error);
    }
};

