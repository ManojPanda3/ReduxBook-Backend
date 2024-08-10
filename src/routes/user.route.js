import { Router } from "express";
import { forgotPassword, isUserExist, resetTokens, userLogin } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/isUserExist').post(isUserExist);
router.route('/userLogin').post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  }
]), userLogin);

router.route('/resetTokens').post(resetTokens);
router.route('/forgotPassword').post(authMiddleware, forgotPassword);
export default router;
