// import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import AppError from "../utils/appError.js";

function signInToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET);
}
function creatSendJWTToken(user, statusCode, res) {
  const token = signInToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // hour*min*sec*milliSec
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  //remove the password
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // const salt = await bcrypt.genSalt();
    // const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    creatSendJWTToken(newUser, 201, res);
    // res.status(201).json({
    //   status: "success",
    //   newUser,
    // });
  } catch (err) {
    res.status(500).json({ status: "failed", error: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    // console.log(user);
    if (!user)
      return next(new AppError("Please provide vaild email and password", 400));
    const isMatch = await user.correctPassword(password, user.password);

    if (!isMatch)
      return next(new AppError("Please provide vaild email and password", 400));

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    creatSendJWTToken(user, 201, res);
    // user.password = undefined;
    // res.status(200).json({
    //   status: "success",
    //   token,
    //   user,
    // });
  } catch (err) {
    res.status(500).json({ status: "failed", error: err.message });
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return next(
        new AppError("You are not logged in, Please login to get access", 401)
      );
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decode.id);

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    res.status(500).json({ status: "failed", error: err.message });
  }
};

export { register, login };
