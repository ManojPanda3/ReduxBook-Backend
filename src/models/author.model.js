import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// users schema / whats data we gonna store 
const AuthorSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  upiId: {
    type: String,
    required: true
  }
}, {
  timeseries: true
});

// creating an user model  
const User = mongoose.model('Author', AuthorSchema);
export default User;
