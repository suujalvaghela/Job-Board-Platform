import { Router } from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from "../controllers/job.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isRecruiterOrAdmin } from "../middlewares/role.middleware.js";

const router = Router();

router.route("/").post(verifyJwt, createJob)
router.route("/").get(getAllJobs)

router.route("/:jobId").get(getJobById)
router.route("/:jobId").put(verifyJwt, isRecruiterOrAdmin, updateJob)
router.route("/:jobId").delete(verifyJwt, isRecruiterOrAdmin, deleteJob)

export default router