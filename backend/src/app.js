import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { connectToSocket } from "./controllers/socketManager.js";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./routes/users.routers.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(express.json({ limit: "70kb" }));
app.use(express.urlencoded({ extended: true, limit: "70kb" }));
app.use("/api/users", usersRouter);


const start = async () => {
    const connectionDB = await mongoose.connect(process.env.MONGODB_URI);
    console.log(connectionDB.connection.host);
    server.listen(app.get("port"), () => {
        console.log("Server running on port " + app.get("port"));
    });
}

start();
