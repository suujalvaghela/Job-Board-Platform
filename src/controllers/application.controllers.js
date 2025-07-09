import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Application } from "../models/application.models.js"
import { Job } from "../models/job.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const applyForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const resumePath = req.file?.path;

  if (!resumePath) {
    throw new ApiError(400, "Resume file is required");
  }

  const resume = await uploadOnCloudinary(resumePath);

  if (!resume.secure_url) {
    throw new ApiError(500, "Resume was not uploaded to Cloudinary");
  }

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const companyId = job.company

  const alreadyApplied = await Application.findOne({ user: userId, job: jobId });
  if (alreadyApplied) {
    throw new ApiError(400, "You have already applied for this job");
  }

  const application = await Application.create({
    user: userId,
    job: jobId,
    company: companyId,
    resume: resume.secure_url,
    status: "applied",
  });

  if (!application) {
    throw new ApiError(500, "Application not created");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, application, "Application successfully filled!"));
});

const getMyApplications = asyncHandler(async (req, res) => {

  const userId = req.user._id;

  const applications = await Application.find({ user: userId })
    .populate("job")

  return res
    .status(200)
    .json(new ApiResponse(201, applications, "Applications fetched!"))

})
const getApplicationsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params

  const applications = await Application.find({ job: jobId })
    .populate({
      path: "job",
      populate: {
        path: "company",
      },
    })
    .populate({
      path: "user",
      select: "-password -refreshToken"
    })


  return res
    .status(200)
    .json(new ApiResponse(201, applications, "Application for job fetched!"))
})
const updateApplicationStatus = asyncHandler(async (req, res) => {

  const { id } = req.params
  const { status } = req.body

  const allowedStatuses = ["applied", "reviewed", "interview", "rejected"];

  if (!allowedStatuses) {
    throw new ApiError(401, "Invalid Status Value")
  }

  const updatedApp = await Application.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedApp) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, updatedApp, "Application Updated successfully"))
})

export {
  applyForJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus
}