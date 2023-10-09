import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { socialMedia } from "../../assets";
import Form from "./Form";

function Login() {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:800px)");
  return (
    <Box
      display="grid"
      gridTemplateColumns="auto 1fr"
      height="100%"
      // backgroundColor={theme.palette.background.alt}
    >
      {isNonMobileScreens && (
        <div className="w-[600px]">
          <img
            src={socialMedia}
            alt="media"
            className="h-full opacity-80 rounded-r-lg "
          />
        </div>
      )}
      <Box margin="20px" textAlign="center">
        <Typography fontWeight="bold" fontSize="clamp(0.6rem, 1.5rem,1.5rem)">
          <span className="from-purple-600 via-pink-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent font-sans font-extrabold top-1">
            VickyMedia
          </span>
        </Typography>
        <Box
          width={isNonMobileScreens ? "50%" : "90%"}
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography
            fontWeight="500"
            variant={isNonMobileScreens ? "h4" : "h5"}
            sx={{ mb: "1.5rem" }}
          >
            Welcome to VickyMedia, the social media for social beings🥳
          </Typography>
          <Form />
        </Box>
        <footer className="text-sm font-bold">
          &copy; Copyright by Vicky Kumar {new Date().getFullYear()}
        </footer>
      </Box>
    </Box>
  );
}

export default Login;
