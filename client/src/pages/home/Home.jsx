import { Box, useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../navbar/NavBar";
import { useSelector } from "react-redux";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/AdvertWidget";
import FriendListWidget from "../widgets/FriendListWidget";

function Home() {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id } = useSelector((state) => state.user);
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          borderRadius="10px"
          padding="5px"
        >
          <UserWidget userId={_id} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          borderRadius="10px"
          padding="5px"
        >
          <MyPostWidget userId={_id} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%" borderRadius="10px" padding="5px">
            <AdvertWidget />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Home;
