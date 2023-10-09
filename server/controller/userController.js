import User from "../model/userModel.js";

const getFriends = async (user) => {
  const friends = await Promise.all(
    user.friends?.map((id) => User.findById(id))
  );
  //for frontend
  const formattedFriends = friends?.map(
    ({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    }
  );
  return formattedFriends;
};

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ _id: userId });
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const getUserFriends = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    // console.log(user.friends);
    //for frontEnd
    const formattedFriends = await getFriends(user);

    res.status(200).json({
      status: "success",
      formattedFriends,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      error: err.message,
    });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    console.log(friend, user);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else if (userId !== friendId) {
      user.friends.push(friendId);
      friend.friends.push(userId);
    }
    await user.save({ validateBeforeSave: false });
    await friend.save({ validateBeforeSave: false });

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
