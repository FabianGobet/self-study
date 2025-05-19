import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { appLogger } from "../loggers/logger.js";
import jwt from "jsonwebtoken";

const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    const accessToken = user.generateAccessToken();
    user.refreshToken = user.generateRefreshToken();
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken: user.refreshToken };
  } catch (error) {
    throw new ApiError(500, error.message, error, error.stack);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  const { avatar, coverImage } = req.files;
  let avatarResp, coverResp;

  try {
    if (
      [fullName, email, username, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required.");
    }

    const isUser = await User.findOne({ $or: [{ username }, { email }] });

    if (isUser) {
      throw new ApiError(409, "Username or email already exists.");
    }
    const avatarLocalPath = avatar[0]?.path;
    const coverLocalPath = coverImage[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required.");
    }

    // Upload to Cloudinary
    avatarResp = await uploadOnCloudinary(avatarLocalPath);

    coverResp = "";
    if (coverImage) {
      coverResp = await uploadOnCloudinary(coverLocalPath);
    }
    const createUserResp = await User.create({
      fullName,
      email,
      username: username.toLowerCase(),
      password,
      avatar: avatarResp.url,
      coverImage: coverResp?.url || ""
    });

    const createdUser = await User.findById(createUserResp._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user.");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully."));
  } catch (error) {
    appLogger.error(`Error in registerUser: ${error.message}`);

    [avatarResp, coverResp].forEach(async (cloud_res) => {
      if (cloud_res) {
        await deleteFromCloudinary(cloud_res.public_id);
      }
    });

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error."));
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username) {
    throw new ApiError(400, "Email and username are required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!(await user.isPasswordValid(password))) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while logging in.");
  }

  const options = {
    httpOnly: true,
    secure: !process.env.__DEV__
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken }, // because express can't set cookies for mobile
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: !process.env.__DEV__
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

const refreshAcessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(403, "Invalid refresh token");
    }

    if (incomingRefreshToken != user?.refreshToken) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: !process.env.__DEV__
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAcessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token.",
      error,
      error.stack
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByIdAndUpdate(req.user?._id);

  const isPassValid = user.isPasswordValid(currentPassword);

  if (!isPassValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully."));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "Full name and email are required.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const newUser = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { fullName, email } },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "User updated successfully."));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required.");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Something went wrong while uploading avatar.");
  }

  const oldUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: false }
  ).select("-password -refreshToken");

  if (!oldUser) {
    throw new ApiError(404, "User not found.");
  }
  const oldAvatarPublicId = oldUser?.avatar?.split("/").pop().split(".")[0];
  await deleteFromCloudinary(oldAvatarPublicId);

  oldUser.avatar = avatar.url;

  return res
    .status(200)
    .json(new ApiResponse(200, oldUser, "Avatar updated successfully."));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) {
    throw new ApiError(400, "Cover image is required.");
  }

  const coverImage = await uploadOnCloudinary(coverLocalPath);
  if (!coverImage) {
    throw new ApiError(
      500,
      "Something went wrong while uploading cover image."
    );
  }

  const oldUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.url } },
    { new: false }
  ).select("-password -refreshToken");

  if (!oldUser) {
    throw new ApiError(404, "User not found.");
  }
  const oldCoverPublicId = oldUser?.coverImage?.split("/").pop().split(".")[0];
  await deleteFromCloudinary(oldCoverPublicId);

  oldUser.coverImage = coverImage.url;

  return res
    .status(200)
    .json(new ApiResponse(200, oldUser, "Cover image updated successfully."));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required.");
  }

  const channel = await User.aggregate([
    {
      $match: { username: username?.toLowerCase() }
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscriptions"
      }
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscriptionsCount: { $size: "$subscriptions" },
        isAutoSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"]
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        username: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        subscriptionsCount: 1,
        isAutoSubscribed: 1
      }
    }
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "Channel profile fetched."));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: req.user?._id
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: { $first: "$owner" }
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 1,
        watchHistory: 1
      }
    }
  ]);

  console.log(user);

  return res
    .status(200)
    .json(
      new ApiResponse(200, user[0]?.watchHistory, "Watch history fetched.")
    );
});

export {
  registerUser,
  loginUser,
  refreshAcessToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory
};
