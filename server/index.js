import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { protect, register } from "./controller/authController.js";
import { createPost } from "./controller/postController.js";
import AppError from "./utils/appError.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import User from "./model/userModel.js";
import Post from "./model/postModel.js";
import { users, posts } from "./data/index.js";
import errorController from "./controller/errorController.js";
// Configurations
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION!! Shutting Down...");
  process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: "./.config.env" });

const app = express();
app.use(express.json({ limit: "30mb" }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// app.use("/assets", express.static(path.join(__dirname, "/public/assets")));
//or
app.use(express.static(`${__dirname}/public/`));

// File Storage.
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    console.log(file);
    cb(null, file.originalname);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image🤔,Please upload an Image", 400), false);
  }
};

const upload = multer({ storage: multerStorage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/post", protect, upload.single("picture"), createPost);

//Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);

app.all("*", (req, res, next) => {
  //Error Handling methods
  //1..
  //   res.status(404).json({
  //     status: 'failed',
  //     message: `Can't find the url ${req.originalUrl}`,
  //   });

  //2..
  //   const err = new Error(`Can't find the url ${req.originalUrl}`);
  //   err.status = 'fail';
  //   err.statusCode = 404;

  //3..
  const err = new AppError(`Can't find the url ${req.originalUrl}`, 404);

  next(err); //if we pass any parameter inside the next, express will automatically come to that any error as occured.
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  (err.status = err.status || "error"),
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
});
// Mongoose
const PORT = process.env.PORT;
// const DB = process.env.DATABASE_URI.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );
const DB = process.env.DATABASE_URI;
mongoose
  .connect(DB, {
    // for connecting to remote database
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    /* ADD DATA ONE TIME */
    // User.insertMany(users, { validateBeforeSave: false });
    // Post.insertMany(posts);
  })
  .catch((err) => console.log(err));

//Event Handler
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED ERROR!! Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});

//Sigterm
process.on("SIGTERM", () => {
  console.log("Recieved Sigterm signal, Shutting the SERVER!!!");
  server.close(() => {
    console.log("Process terminated");
  });
});
