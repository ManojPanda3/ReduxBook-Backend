import { Router } from "express";
import { createUser, forgotPassword, getCurrentUser, isUserExist, resetTokens, userLogin } from "../controllers/user.controller.js"
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
export default router;
