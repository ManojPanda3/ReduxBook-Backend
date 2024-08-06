import { Router } from "express";
import { userLogin, userRegister } from "../controllers/user.controller.js"
import {upload }from "../middlewares/multer.middleware.js"

const router = Router();

router.route('/singup').post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  }
]),userRegister );

export default router;
