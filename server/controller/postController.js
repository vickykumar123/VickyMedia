import Post from "../model/postModel.js";
import AppError from "../utils/appError.js";

export const createPost = async (req, res, next) => {
  try {
    const { userId = req.user._id, description, picturePath } = req.body;
    if (req.user._id !== userId) {
      return next(new AppError("You dont have required permission 🚫", 400));
    }
    const newPost = await Post.create({
      userId: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      location: req.user.location,
      description,
      userPicturePath: req.user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    let post = await Post.find().sort({ createdAt: -1 });

    res.status(201).json({
      status: "success",
      post,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    let post = await Post.find().sort({ createdAt: -1 });

    res.status(201).json({
      status: "success",
      post,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    if (!post) return next(new AppError("Cant find the post", 400));
    res.status(200).json({
      status: "success",
      post,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    console.log(req.user._id);
    const post = await Post.findById(postId);
    const isLiked = post.likes.get(userId); //get,set,delete because we are using map data structure

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    const updatedpost = await Post.findByIdAndUpdate(
      postId,
      {
        likes: post.likes,
      },
      {
        new: true,
      }
    );
    // post.save();
    res.status(200).json(updatedpost);
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err.message,
    });
  }
};
