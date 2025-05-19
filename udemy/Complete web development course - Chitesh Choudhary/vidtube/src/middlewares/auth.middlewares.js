import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  const accessToken =
    req.cookies.accessToken ||
    req.body.accessToken ||
    req.header["authorization"]?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, "Access token is required.");
  }
  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(403, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
});
