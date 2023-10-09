import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      requried: [true, "First name is required"],
      min: 3,
      max: 30,
    },
    lastName: {
      type: String,
      requried: [true, "Last name is required"],
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide the valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: 8,
      max: 50,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm the password"],
      validate: {
        //This works only on save and create
        validator: function (el) {
          return el === this.password;
        },
        message: "Password are not the Same!!",
      },
    },
    picturePath: {
      type: String,
      default: "default.jpg",
    },
    friends: {
      type: Array,
      default: [],
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //This will run only if password is modified
  if (!this.isModified("password")) return next();

  //Hashing the password with 12 salt
  this.password = await bcryptjs.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

//Checking encrypted password and password from user login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
