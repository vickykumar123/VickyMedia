import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/userSlice";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = useCallback(async () => {
    const response = await fetch("/post", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    // console.log(data);
    dispatch(setPosts({ posts: data.post }));
    setIsLoading(false);
  }, [dispatch, token]);

  const getUserPosts = useCallback(async () => {
    const response = await fetch(`/post/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    // console.log(data);
    dispatch(setPosts({ posts: data.post }));
    setIsLoading(false);
  }, [dispatch, token, userId]);

  useEffect(() => {
    if (isProfile) {
      setIsLoading(true);
      getUserPosts();
    } else {
      setIsLoading(true);
      getPosts();
    }
  }, [isProfile, getPosts, getUserPosts]);

  if (isLoading) return <div>Loading.....</div>;
  // console.log(isLoading);

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
