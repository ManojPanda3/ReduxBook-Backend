import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createTag, getTag } from "../controllers/tag.controller.js";

const router = Router();

router.route("/getTag").post(getTag);
router.route("/createTag").post(authMiddleware, createTag);

export default router;
