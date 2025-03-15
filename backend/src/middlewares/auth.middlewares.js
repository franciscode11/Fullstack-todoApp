import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

const verifyToken = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === "undefined") {
    throw new ApiError(401, "Unauthorized");
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(payload?._id).select(
      "-password "
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyToken };
