import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"
import emailSender from "../email/index.js"
import Auth from "../models/auth.model.js";
import jwt from "jsonwebtoken";

// a random num generater acd to seed
const generateOtp = () => {
  const rand = (seed) => {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;
    return Math.abs(seed / 0x10000000);
  }
  return Math.floor(rand(Date.now()) * 1e6);
}

//sending otp for authentication
export const sendOtp = asyncHandler(async (req, res) => {
  // TODO:
  // first extract the username and email
  // generate an otp
  // create auth model in db and send an email to the user to verify it 
  // and send an success msg to user

  const { email, username } = req.body;
  if (!email) {
    throw new ApiError(401, "invelid email")
  }
  // generte otp 
  const genOtp = generateOtp();
  if (!genOtp) throw new ApiError(500, "something wentWrong while Generating otp");


  // for reseting all the index bcz ttl index is got corrupted uncomment them if they needed 
  // await Auth.collection.dropIndexes();
  // await Auth.syncIndexes();


  // creating a new auth process
  const auth = await Auth.create({
    otp: genOtp,
    email: email,
    createdAt: Date.now(),
  });
  if (!auth) throw new ApiError(500, "somthing went wrong while saving otp");


  // send the email with otp
  const info = await emailSender(email,
    {
      "subject": "Verify Your Account - ReduxBook",
      "text": `Hi [${username ? username : "User"}],\n\nWe're excited to have you on board! To complete your registration, please verify your account by entering the following OTP code: ${genOtp}\n\nThis code is valid for 10 minutes. If you did not request to verify your account, please ignore this email.\n\nThanks,\n[ReaduxBook]`,
      "html": `<html>\n<head>\n<title>Verify Your Account</title>\n</head>\n<body>\n<h1>Welcome to ReaduxBook!</h1>\n<p>Hi [${username ? username : "User"}],</p>\n<p>To complete your registration, please verify your account by entering the following OTP code:</p>\n<p><strong>${genOtp}</strong></p>\n<p>This code is valid for 10 minutes. If you did not request to verify your account, please ignore this email.</p>\n<p>Thanks,</p>\n<p>[ReaduxBook]</p>\n</body>\n</html>`
    }
  )
  if (!info) throw new ApiError(500, "Something went wrong while sending email");
  console.log("msg: ", info); // for debug 

  // create a authToken 
  const AuthToken = jwt.sign({
    _id: auth?._id,
  },
    process.env.AUTHTOKEN_SECRET
    ,
    {
      expiresIn: 600,
    })

  // send auth token to the user 
  return res.status(200).json(new ApiResponse(200, { AuthToken: AuthToken }, "otp sended successfully"));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  // TODO:
  // first extract the otp and AuthToken
  // decodethe token and extract the authId 
  // check if the authentication process still exist or not 
  // match the otp if matched del the auth and send a success msg 

  const { otp, AuthToken } = req.body;
  if (!otp || !AuthToken) throw new ApiError(401, "all fields are required");

  // extracting auth id 
  const authId = jwt.verify(AuthToken, process.env.AUTHTOKEN_SECRET);


  // finding the auth process 
  const sendedOtp = await Auth.findById(authId?._id);
  if (!sendedOtp) throw new ApiError(404, "otp was expired");


  // check if otp matched or not 
  const isOtpMatch = await sendedOtp.isOtpMatched(otp);
  if (!isOtpMatch) throw new ApiError(401, "Invelid otp");

  // verify the user 
  sendedOtp.isVerified = true;
  sendedOtp.save({ validateBeforeSave: false });


  // retur a 200 response 
  return res.status(200).json(new ApiResponse(200, { isOtpMatch: true }, "Otp verified "))
})

export const resendOtp = asyncHandler((req, res) => {

  const { AuthToken } = req.body;
  if (!AuthToken) throw new ApiError(401, "Invelid AuthToken");

  // extracting the authId.
  const authId = jwt.verify(AuthToken, process.env.AUTHTOKEN_SECRET)?._id;
  if (!authId) throw new ApiError(401, "Invelid AuthToken");
  // delete the prev auth process on resending the otp 
  Auth.deleteOne(authId);

  // recreatung the auth process 
  return sendOtp(req, res);
})
