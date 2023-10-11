import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import toast from "react-hot-toast";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/userSlice";

function MyPostWidget() {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery("(min-width:800px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  //   console.log(user);

  async function handlePost() {
    const formData = new FormData();
    // formData.append("userId", user._id);
    formData.append("description", description);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    try {
      const response = await fetch("http://127.0.0.1:3000/post", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      const posts = data.post;
      dispatch(setPosts({ posts }));
      toast("Post uploaded Successfully 🥳");
      setImage(null);
      setDescription("");
      setIsImage(false);
    } catch (err) {
      toast(err);
    }
  }

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={user.picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p className="text-sm italic ">Post Here 📸</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{
                      width: "10%",
                      color: "red",
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor: "#f797973a",
                      },
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}
      <Divider sx={{ margin: "1.25rem 0" }} />
      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: medium,
              },
            }}
          >
            Image
          </Typography>
        </FlexBetween>
        {isNonMobileScreen ? (
          <>
            <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    color: medium,
                  },
                }}
              >
                Clip
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    color: medium,
                  },
                }}
              >
                Attachment
              </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    color: medium,
                  },
                }}
              >
                Audio
              </Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween
            gap="0.25rem"
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: medium,
              },
            }}
          >
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!description}
          onClick={handlePost}
          cursor="pointer"
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
}

export default MyPostWidget;
