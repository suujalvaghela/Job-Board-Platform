import mongoose from "mongoose";
import { User } from "./user.models";
import { Job } from "./job.models";

const applicationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Job,
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "reviewed", "interview", "rejected"],
      default: "applied",
    },
    appliedAt: {
      type: Date,  
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model("Application", applicationSchema);
