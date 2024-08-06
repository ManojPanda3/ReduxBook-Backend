import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.db.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

// connect to db then start the app
connectDB()
  .then(
    () => {
      try {
        app.listen(port, () => {
          console.info("Server started at ", port);
        });
      } catch (error) {
        console.error("Something went wrong while starting the sever\nError: ", error);
      }
    }
  );
