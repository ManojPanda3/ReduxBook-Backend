import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js"

const generateOtp = () => {
  return floor(Math.random())
}
const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw ApiError(401, "invelid email")
  }

});
