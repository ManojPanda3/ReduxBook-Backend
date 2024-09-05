import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";


const authMiddleware = asyncHandler(async (req, _, next) => {

  // extract the cookies from the req or header .
  const { accessToken } = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") || "";
  if (!accessToken) throw new ApiError(401, "accessToken is required");

  // decode the jwt to get info inside of it 
  const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET);
  if (!decodedAccessToken) throw new ApiError(401, "invelid accessToken");

  // fing the user 
  const user = await User.findById(decodedAccessToken?._id);
  if (!user) throw new ApiError(401, "User does\'t exist");

  // save the user
  req.user = user;

  // run other processes
  next();
});

export default authMiddleware;
