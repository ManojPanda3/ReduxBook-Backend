import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import User from "../models/user.model.js";
import storage, { firebaseFileUpload } from "../storage/index.storage.js";
import { ref } from "firebase/storage";
import Auth from "../models/auth.model.js";
import { decode } from "jsonwebtoken";

const DirRef = {
  avatar: ref(storage, 'avatar'),
  book: ref(storage, 'book/doc'),
  bookCoverimage: ref(storage, 'book/cover-image'),
}

// generating auth Tokens
const generatorToken = async (userId) => {
  try {
    // find the user 
    const user = await User.findById(userId);

    // gen the token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save the tokens on server
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Something went wrong while generating tokens,\n Error: ", error);
  }
}

// check if a user exist or not 
export const isUserExist = asyncHandler(async (req, res) => {
  console.log(req);
  const { email, username, accessToken } = req.body;
  if (accessToken) {
    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET);
    if (!decodedAccessToken) throw new ApiError(401, "invelid accessToken");
    const user = await User.findById(decodedAccessToken?._id);
  } else {
    if (!email && !username) {
      throw new ApiError(401, "invelid username/email");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
  }
  return res.status(200).json(new ApiResponse(200, { isUserExist: (user ? true : false) }))
});
// create a  user 
export const createUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password, AuthToken, description } = req.body;

  // checking if given data is correct or not 
  if ([username, AuthToken, fullname, email, password].some((elm) => (elm?.trim() === ""))) {
    throw new ApiError(400, "All fields(username, fullname, email, password) are required");
  }
  const authId = jwt.verify(AuthToken, process.env.AUTHTOKEN_SECRET);
  // finding the auth process 
  const sendedOtp = await Auth.findById(authId?._id);

  if (!sendedOtp) throw new ApiError(402, "Authantication timeOut")
  if (!sendedOtp?.isVerified) throw new ApiError(401, "email not verified");

  // upload the avatar to localStorage 
  const avatarLocalFile = req.file.avatar[0].path;
  if (!avatarLocalFile) throw new ApiError(400, "Avatar is required");

  // upload the avatar to the cloud 
  const avatar = await firebaseFileUpload(avatarLocalFile, DirRef[avatar]);
  if (!avatar) throw new ApiError(500, "Server Error, Something went wrong while uploading avatar");

  //create the user 
  const user = await User.create({
    username: username.trim().toLowerCase(), fullname, email, password, description, avatar
  });

  // check the user 
  const createdUser = await User.findOne(user?._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Server Error, Something went wrong while creating account");

  // check if the user exist or not 
  return res.status(200).json(new ApiResponse(200, createdUser, "User created successfully"));
});

// logged in a user
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
  if (!user) throw new ApiError(401, "Invelid credentials");
  const isPasswordCorrect = user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invelid password");

  // check the user 
  const createdUser = await User.findOne(user?._id);
  if (!createdUser) throw new ApiError(500, "Server Error, Something went wrong while creating account");

  const { accessToken, refreshToken } = await generatorToken(user?._id);
  const LoggedInUser = await User.findById(user?._id,).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  }
  // check if the user exist or not 
  return res.status(200)
    .cookie(
      "accessToken", accessToken, options
    ).cookie(
      "refreshToken", refreshToken, options
    )
    .json(new ApiResponse(200, {
      userdata: LoggedInUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }, "User created successfully"));
});

// to reset the refresh and acess token
export const resetTokens = asyncHandler(async (req, res) => {
  // TODO:
  // get the refreshToken and decode the id 
  // check if user exist and extract user data ;
  // check if user refresh token and given refreshToken match or not ;
  // recreate the refresh and acess token ;
  // save the refresh token on dataBase ;
  // send the refresh and acess Token through cookies and json .

  // extracting uesr data.
  const receivedRefreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!receivedRefreshToken) throw new ApiError(401, "Invelid credentials");

  //decode the refreshToken ;
  const decodedRefreshToken = jwt.verify(receivedRefreshToken, process.env.REFRESHTOKEN_SECRET);

  // finding user .
  const user = User.findById(decodedRefreshToken?._id);
  if (!user) throw new ApiError(401, "User does\'t exist");
  if (user?.refreshToken !== receivedRefreshToken) throw new ApiError(401, "refreshToken is expired or else used");

  // generating tokens and saving it in the db
  const { accessToken, refreshToken } = await generatorToken(user?._id);

  const LoggedInUser = await User.findById(user?._id,).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  }

  // check if the user exist or not 
  return res.status(200)
    .cookie(
      "accessToken", accessToken, options
    ).cookie(
      "refreshToken", refreshToken, options
    )
    .json(new ApiResponse(200, {
      userdata: LoggedInUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }, "User created successfully"));

});

// forgot the uer password ; 
export const forgotPassword = asyncHandler(async (req, res) => {
  // TODO: 
  // get old And new password ;
  // get user details ;
  // check the oldPassword ;
  // change the password ;
  // save it on db ; 

  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) throw new ApiError(401, "All fields are required");
  const user = req.user;
  if (!user.isPasswordCorrect(onChildAdded)) throw new ApiError(401, "Invalid oldPassword. Please try again.");
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {

  }, "Password changed successfully"))
});

// userDetails graber ;
export const userDetails = asyncHandler(async (req, res) => {
  // TODO: 
  // get user datas ;
  // delete unnesesery datas using a aggregation pipeline and select ;
  // send the data 
  const { username, email } = req.body;
  if (!username && !email) throw new ApiError(401, "All fields are required")
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select("-password -refreshToken");
  if (!user) throw new ApiError(401, "invelid uername/email")
  return res.status(200).json(
    new ApiResponse(200, user, "userDetails fetched successfully")
  );
})

// get Author Details ;
export const authorDetails = asyncHandler(async (req, res) => {
  // TODO: 
  // get user datas ;
  // delete unnesesery datas using a aggregation pipeline and select ;
  // send the data 
  const { username } = req.body;
  if (!username) throw new ApiError(401, "All fields are required")
  const user = await User.aggregate([{
    $match: {
      username: username?.trim().toLowerCase(),
    }
  }, {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "author",
      as: "publishedBooks",
      pipeline: [{
        $project: {
          name: 1,
          coverImage: 1,
          likes: 1,
          totalReviews: 1,
          tags: 1,
          price: 1,
        }
      },]
    }
  }, {
    $addFields: {
      totalPublishedBook: {
        $size: "$publishedBooks",
      },
    }
  }]).select("-password -refreshToken");
  if (!user) throw new ApiError(401, "invelid uername/email")
  console.log(user);
  return res.status(200).json(
    new ApiResponse(200, user, "userDetails fetched successfully")
  );
})
