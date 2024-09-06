import dotenv from "dotenv";
import app from "../src/app.js";
import connectDB from "../src/db/index.db.js";
import FirebaseStorage from "../src/storage/index.storage.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT;
export let Storage;
// connect to db then start the app
connectDB()

  .then(() => {
    try {
      const DirRef = {
        avatar: '/public_uploads/avatar',
        book: '/protected/book/doc',
        bookCoverimage: '/public_uploads/book/cover-image',
      }
      Storage = new FirebaseStorage(DirRef);
    } catch (err) {
      console.error("Error while connecting to storage , \n Error: ", err)
    }
  })
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
