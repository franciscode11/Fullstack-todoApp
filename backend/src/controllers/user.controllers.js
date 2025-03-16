import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  return { accessToken, refreshToken };
};

const signUp = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) throw new ApiError(400, "Email field is required");
  if (!password) throw new ApiError(400, "Password field is required");

  if (!validator.isEmail(email))
    throw new ApiError(400, "Invalid email format");

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists)
    throw new ApiError(409, "This email is already in use");

  const user = await User.create({ email, password });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: user._id,
          email: user.email,
        },
      },
      "User registered successfully"
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email?.trim().toLowerCase();
  const currentPassword = password?.trim();

  if (!lowerCaseEmail) throw new ApiError(400, "Email field is required");
  if (!currentPassword) throw new ApiError(400, "Password field is required");

  if (!validator.isEmail(lowerCaseEmail))
    throw new ApiError(400, "Invalid email format");

  const user = await User.findOne({ email: lowerCaseEmail });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid user credentials");

  //Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || user === "undefined") throw new ApiError(401, "Unauthorized");

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refresh = asyncHandler(async (req, res) => {
  const token =
    req.cookies.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === "undefined") throw new ApiError(401, "Unauthorized");

  let payload;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await User.findById(payload._id);

  if (!user) throw new ApiError(401, "Unauthorized");

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(200, null, "Tokens refreshed successfully"));
});

const verifyUser = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || user === "undefined") throw new ApiError(401, "Unauthorized");
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "user is logged in"));
});

export { signUp, login, logout, refresh, verifyUser };
