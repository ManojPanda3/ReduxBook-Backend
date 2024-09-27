import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// CORS setup so only allowed ip can call the api
const corsOptions = {
  origin: (ori, callback) => {
    const whitelist = process.env.CORS_ORIGIN.split(",");
    if (whitelist.indexOf("*") != -1 || !ori) { callback(null, true) }
    else if (whitelist.indexOf(ori) != -1) { callback(null, true) }
    else { callback(new Error(`This address(${ori}) is not in whitelist :(`)); }
  },
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions));

// some express configurations 
app.use(express.json({ limit: "8kb" }));
// app.use(express.text({ limit: "8kb" }));
app.use(express.urlencoded({ extended: true, limit: "8kb" }));
app.use(express.static("public")); // setup the public folder for all the static datas like images

// setup cookieParser middleware
app.use(cookieParser());

// routes 
import userRoutes from "./routes/user.route.js";
import emailRoutes from "./routes/email.route.js";
import bookRoutes from "./routes/book.route.js";
import tagRoutes from "./routes/tag.route.js";

app.get('/api', (req, res) => { return res.send("<p>/api/v1/{user,email,book}/</p>") });
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/email', emailRoutes);
app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/tag', tagRoutes);

export default app;
