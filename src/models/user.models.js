import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "password must be required"],
    },
    coverImage: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["seeker", "employer", "admin"],
      default: "seeker",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("USer", userSchema);
