import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createTag, getTag,handleTagChange } from "../controllers/tag.controller.js";

const router = Router();

router.route("/getTag").post(getTag);
router.route("/createTag").post(authMiddleware, createTag);
router.route("/tagSuggest").post(handleTagChange);

export default router;
