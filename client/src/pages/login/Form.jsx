import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state/userSlice";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Container from "@mui/material/Container";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import toast from "react-hot-toast";
// import { ToastContainer, toast } from "react-toastify";

const signUpSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Firstname is required"),

  lastName: yup
    .string()
    .min(1, "Too Short!")
    .max(50, "Too Long!")
    .required("Lastname is required"),

  email: yup.string().email().required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password is too short - should be 8 chars minimum"),
  passwordConfirm: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.string(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const initialValueSignUp = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

function Form() {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isNonMobileScreen = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isSignup = pageType === "signup";

  const signup = async (values, onSubmitProps) => {
    try {
      // this allows us to send form info with image
      const formData = new FormData();
      // console.log(values);
      for (let value in values) {
        console.log(value, values[value]);
        formData.append(value, values[value]);
      }
      formData?.append("picturePath", values?.picture?.name || "default.jpg");
      console.log(formData);

      const savedUserResponse = await fetch(
        "http://127.0.0.1:3000/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );
      const savedUser = await savedUserResponse.json();
      if (savedUser.status === "failed") {
        throw new Error(savedUser.message);
      }
      onSubmitProps.resetForm();

      if (savedUser) {
        toast("🥳 Signned up successfully");
        setPageType("login");
      }
    } catch (err) {
      toast(`🚫 ${err}`);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      // console.log(JSON.stringify(values));
      const loggedInResponse = await fetch("http://127.0.0.1:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        // body: values, will not work must stringify
      });
      const loggedIn = await loggedInResponse.json();
      if (loggedIn.status === "failed") {
        throw new Error(loggedIn.message);
      }

      onSubmitProps.resetForm();

      if (loggedIn) {
        dispatch(
          setLogin({
            user: loggedIn?.data?.user, //from response
            token: loggedIn?.token,
          })
        );
        toast("🥳 Loggedin successfully");
        navigate("/home");
        // console.log(user);
      }
    } catch (err) {
      toast(`❌ ${err}`);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isSignup) await signup(values, onSubmitProps);
  };

  return (
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {isLogin ? <LockOutlinedIcon /> : <AssignmentIndIcon />}
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLogin ? "Login" : "Sign in"}
        </Typography>
      </Box>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={isLogin ? initialValueLogin : initialValueSignUp}
        validationSchema={isLogin ? loginSchema : signUpSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleSubmit,
          handleChange,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(2,minmax(0,1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobileScreen ? undefined : "span 3",
                },
              }}
            >
              {isSignup && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastNameName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 1" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.loction}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    label="Confirm Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.passwordConfirm}
                    name="passwordConfirm"
                    error={
                      Boolean(touched.passwordConfirm) &&
                      Boolean(errors.passwordConfirm)
                    }
                    helperText={
                      touched.passwordConfirm && errors.passwordConfirm
                    }
                    sx={{ gridColumn: "span 3" }}
                  />
                  <Box
                    gridColumn="span 3"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${palette.primary.main}`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          {/* <input {...getInputProps} /> */}
                          {!values.picture ? (
                            <p>Upload Profile Pic</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                  </Box>
                </>
              )}

              {isLogin && (
                <>
                  <TextField
                    label="Email"
                    type="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={Boolean(touched.email) && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 3" }}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={
                      Boolean(touched.password) && Boolean(errors.password)
                    }
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 3" }}
                  />
                </>
              )}
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.primary.dark,
                  "&:hover": { color: palette.primary.dark },
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "signup" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.dark,
                  },
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
}

export default Form;
