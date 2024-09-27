import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// users schema / whats data we gonna store 
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  avatar: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ""
  },
  BoughtBook: [{
    type: mongoose.Types.ObjectId,
    ref: "Book"
  }],
  intrestedTags: [{
    type: mongoose.Types.ObjectId,
    ref: "Book"
  }],
  paymentDetails: {
    type: String
  }
}, {
  timeseries: true
});

// a func which run before every update of a user data and check if password is changing if yes then hash it 
UserSchema.pre("save", async function(next) {
  if (this.isModified(this.intrestedTags)) {
    this.intrestedTags = [...new Set(this.intrestedTags)]
  }
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  return next();
})

// a method to compare a hashed password with user given password
UserSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

// Generating An access token
UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESSTOKEN_SECRET
    ,
    {
      expiresIn: process.env.ACCESSTOKEN_EXPIRE * 1000,
    }
  );
}

// Generating An refresh token
UserSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESHTOKEN_SECRET,
    {
      expiresIn: process.env.REFRESHTOKEN_EXPIRE * 1000,
    }
  );
}

// creating an user model  
const User = mongoose.model('User', UserSchema);
export default User;
