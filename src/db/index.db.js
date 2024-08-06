import mongoose from "mongoose";
import { DB_NAME } from "../constants/index.const.js";

const connectDB = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.info("mongodb connect of uri :", db.connection.host);
  } catch (error) {
    console.error("Something went wrong while connecting to DB;\n Error: ", error);
  }

}
export default connectDB;
