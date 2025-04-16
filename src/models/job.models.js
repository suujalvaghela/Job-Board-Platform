import mongoose, { Schema } from "mongoose";
import { User } from "./user.models";
import { Company } from "./company.models";

const jobSchemas = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    discription: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["part-time", "full-time", "internship", "remote"],
      required: true,
    },
    location: {
      type: String,
    },
    salaryRange: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Company,
      required: true,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchemas);
