import { Router } from "express";
import { isUserExist, userLogin } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.route('/isUserExist').post(isUserExist);
router.route('/userLogin').post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  }
]), userLogin);

export default router;
