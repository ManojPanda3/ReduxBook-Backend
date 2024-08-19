import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/db/index.db.js";

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
  ).catch(err => console.error("Error while connecting to db \n Error: ", err));
export default app;
