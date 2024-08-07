import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

// CORS setup so only allowed ip can call the api
const options = {
  origin: process.env.CORS_ORIGIN,
  credentials: true
}
app.use(cors(options));
// some express configurations 
app.use(express.json({ limit: "8kb" }));
app.use(express.urlencoded({ extended: true, limit: "8kb" }));
app.use(express.static("public")); // setup the public folder for all the static datas like images
// setup cookieParser middleware
app.use(cookieParser());


// routes 
import userRoutes from "./routes/user.route.js"
app.use('/api/v1/user', userRoutes);

export default app;
