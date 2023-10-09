import express from "express";
import {
  getAllUser,
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controller/userController.js";
import { protect } from "../controller/authController.js";

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/", getAllUser);
userRouter.get("/:userId", getUser);
userRouter.get("/:userId/friends", getUserFriends);
userRouter.patch("/:userId/:friendId", addRemoveFriend);

export default userRouter;
