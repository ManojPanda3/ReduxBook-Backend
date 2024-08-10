import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";

// otp schema / whats data we gonna store 
const AuthSchema = new Schema({
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    expires: parseInt(process.env.OTP_EXPIRE, 10),
  },
});
AuthSchema.pre("save", async function(next) {
  if (!this.isModified("otp")) { return next(); }
  this.otp = await bcrypt.hash(this.otp, 10);
  return next();
});

AuthSchema.methods.isOtpMatched = async function(otp) {
  return await bcrypt.compare(otp, this.otp);
}
// creating an otp model  
const Auth = mongoose.model('Auth', AuthSchema);
export default Auth;
