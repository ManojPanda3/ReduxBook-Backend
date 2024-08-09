import { Router } from "express";

import { sendOtp, verifyOtp, resendOtp } from "../controllers/email.controller.js";
const router = Router();

router.route('/sendotp').post(sendOtp);
router.route('/verifyotp').post(verifyOtp);
router.route('/resendotp').post(resendOtp);

export default router;
