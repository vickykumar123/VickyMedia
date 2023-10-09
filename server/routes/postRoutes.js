import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
} from "../controller/postController.js";
import { protect } from "../controller/authController.js";
import cors from "cors";

const postRouter = express.Router();
postRouter.use(protect);
postRouter.options("/", cors());
postRouter.get("/", getFeedPosts);
postRouter.get("/:userId/posts", getUserPosts);

postRouter.patch("/:postId/like", likePost);

export default postRouter;
