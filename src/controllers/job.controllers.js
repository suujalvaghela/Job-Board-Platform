import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Job } from "../models/job.models.js";

const createJob = asyncHandler(async (req, res) => {
    const {
        title,
        discription,
        type,
        location,
        salaryRange,
        company,
        expiresAt,
    } = req.body;

    if (
        [title, discription, type, salaryRange, company].some(
            (field) => !field || field.trim() === ""
        )) {
        throw new ApiError(400, "All required fields must be provided");
    }


    const job = await Job.create({
        title,
        discription,
        type,
        location,
        salaryRange,
        company,
        user: req.user._id,
        expiresAt,
    });

    if (!job) {
        throw new ApiError(501, "Job not created yet")
    }

    return res
        .status(200)
        .json(new ApiResponse(201, job, "Job Created Successfully!"))

})

const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find()
        .populate("user", "fullName email")
        .populate("company", "name");

    if (!jobs || jobs.length === 0) {
        throw new ApiError(404, "No jobs found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, jobs, "All jobs fetched successfully"));
});

const getJobById = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
        .populate("user", "fullName email")
        .populate("company", "name");

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, job, "Job fetched successfully"));
});

const updateJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this job");
    }

    const updates = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updates, {
        new: true,
    });

    if (!updatedJob) {
        throw new ApiError(501, "job not updated yet")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedJob, "Job updated successfully"));
});

const deleteJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this job");
    }

    const deletedJob = await job.deleteOne();

    if (!deletedJob) {
        throw new ApiError(501, "job not deleted yet")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedJob, "Job deleted successfully"));
});

export {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob
}