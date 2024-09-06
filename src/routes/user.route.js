import { Router } from "express";
import { createUser, forgotPassword, getCurrentUser, isUserExist, resetTokens, userDetails, userLogin, userLogout } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/isUserExist').post(isUserExist);
router.route('/userLogin').post(userLogin);
router.route('/createUser').post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  }
]), createUser);

router.route('/getCurrentUser').post(authMiddleware, getCurrentUser);
router.route('/resetTokens').post(resetTokens);
router.route('/forgotPassword').post(authMiddleware, forgotPassword);
router.route('/logout').post(authMiddleware, userLogout);
router.route('/getUserDetails').post(userDetails);

export default router;
