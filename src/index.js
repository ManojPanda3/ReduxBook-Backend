import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


import app from "./app.js";
import connectDB from "./db/index.db.js";
import FirebaseStorage from "./storage/index.storage.js";

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
