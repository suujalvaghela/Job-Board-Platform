import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { Job } from "../models/job.models.js";
import { Application } from "../models/application.models.js";
import { Company } from "../models/company.models.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // take data from req body
  // check validation
  // check user exist or not
  // check about photo
  // upload on cloudinary
  // make user object - for db
  // again validation
  // finally res 

  const { userName, email, fullName, password, role } = req.body;

  if (
    [userName, email, fullName, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(404, "all fields must be required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (existingUser) {
    throw new ApiError(401, "User is already existing");
  }

  // let coverImagePath;

  // if (
  //   req.files &&
  //   Array.isArray(req.files.coverImage) &&
  //   req.files.coverImage.length > 0
  // ) {
  //   coverImagePath = req.files.coverImage[0].path;
  // }

  // // if (!coverImagePath) {
  // //   throw new ApiError(401, "Path of image must be required");
  // // }

  // const coverImage = await uploadOnCloudinary(coverImagePath);

  // if (!coverImage?.url) {
  //   throw new ApiError(401, "image is not uploaded on cloudinary");
  // }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    password,
    role,
    // coverImage: coverImage.url,
  });

  const newUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!newUser) {
    throw new ApiError(501, "user not created yet something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newUser, "User created successfully"));
});

const logInUser = asyncHandler(async (req, res) => {
  // take email or username and pass
  // validation
  // exist or not
  // pass validation
  // tokens
  // cookies
  // res

  const { email, userName, password } = req.body;

  if (!email && !userName) {
    throw new ApiError(401, "Either email or username is required");
  }

  if (!password) {
    throw new ApiError(401, "password is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (!user) {
    throw new ApiError(401, "user is not exist");
  }

  const isPassCorrect = await user.isPasswordCorrect(password);

  if (!isPassCorrect) {
    throw new ApiError(401, "wrong password entered");
  }

  const existedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(200, existedUser, "user loggedin successfully")
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  // get user
  // remove token
  // res

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  if (!user) {
    throw new ApiError(401, "Something went wrong while logout");
  }

  const Option = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", Option)
    .clearCookie("refreshToken", Option)
    .json(new ApiResponse(200, {}, "User loggedOut successfully"));
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 1️⃣ Find all companies owned by user
  const userCompanies = await Company.find({ user: userId }).select("_id");
  const companyIds = userCompanies.map(c => c._id);

  // 2️⃣ Find all jobs for these companies
  const jobs = await Job.find({ company: { $in: companyIds } }).select("_id");
  const jobIds = jobs.map(j => j._id);

  // 3️⃣ Delete applications for these jobs
  await Application.deleteMany({ job: { $in: jobIds } });

  // 4️⃣ Delete applications made directly by the user
  await Application.deleteMany({ user: userId });

  // 5️⃣ Delete jobs
  await Job.deleteMany({ company: { $in: companyIds } });

  // 6️⃣ Delete companies
  await Company.deleteMany({ user: userId });

  // 7️⃣ Delete user
  await User.findByIdAndDelete(userId);

  // clear cookies
  const option = { httpOnly: true, secure: true, sameSite: "Strict" };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User and all related data deleted successfully"));
});


export {
  registerUser,
  logInUser,
  logOutUser,
  deleteUserProfile
};
