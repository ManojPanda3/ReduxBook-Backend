import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js";
import storage, { firebaseFileUpload } from "../storage/index.storage.js";
import { ref } from "firebase/storage";

const DirRef = {
  avatar: ref(storage, 'avatar'),
  book: ref(storage, 'book/doc'),
  bookCoverimage: ref(storage, 'book/cover-image'),
}
const generatorToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Something went wrong while generating tokens,\n Error: ", error);
  }
}
export const userRegister = asyncHandler(async (req, res) => {
  // TODO:
  // get user details and check it 
  // get avatar file and upload it 
  // create user in db 
  // check users existance and send the data to user 

  // get the data 
  const { username, fullname, email, password, description } = req.body;

  // checking if given data is correct or not 
  if ([username, fullname, email, password].some((elm) => (elm?.trim() === ""))) {
    throw new ApiError(400, "All fields(username, fullname, email, password) are required");
  }
  const checkUserExistance = User.findOne({
    $or: [{ username }, { email }]
  }) ? 1 : 0;
  if (checkUserExistance) throw new ApiError(401, "Username/Email already registered");
  // upload the avatar to localStorage 
  const avatarLocalFile = req.file.avatar[0].path;
  if (!avatarLocalFile) throw new ApiError(400, "Avatar is required");

  // upload the avatar to the cloud 
  const avatar = await firebaseFileUpload(avatarLocalFile, DirRef[avatar]);
  if (!avatar) throw new ApiError(500, "Server Error, Something went wrong while uploading avatar");

  //create the user 
  const user = await User.create({
    username, fullname, email, password, description, avatar
  });

  // check the user 
  const createdUser = await User.findOne(user?._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Server Error, Something went wrong while creating account");

  // check if the user exist or not 
  return res.status(200).json(new ApiResponse(200, createdUser, "User created successfully"));
});

export const userLogin = asyncHandler(async (req, res) => {
  // TODO:
  // get user details and check it if it empty or not 
  // pull user data from db through id and checkit 
  // then compare the password and if false throw error 

  // get the data 
  const { username, email, password } = req.body;

  // checking if given data is correct or not 
  if (!username && !email) {
    throw new ApiError(404, "All fields(username, fullname, email, password) are required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }]
  })
  if (!user) return new ApiError(401, "Invelid credentials");
  const isPasswordCorrect = user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invelid password");

  // check the user 
  const createdUser = await User.findOne(user?._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Server Error, Something went wrong while creating account");

  const { accessToken, refreshToken } = await generatorToken(user?._id);
  const LoggedInUser = await User.findById(user?._id,);

  // check if the user exist or not 
  return res.status(200).json(new ApiResponse(200, {
    userdata: LoggedInUser,
    accessToken: accessToken,
    refreshToken: refreshToken,
  }, "User created successfully"));
});

