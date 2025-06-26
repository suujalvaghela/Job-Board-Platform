import { Router } from "express";
import { createJob, getAllJobs, getJobById, updateJob, deleteJob } from "../controllers/job.controllers";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router.route("/").post(createJob)
router.route("/").get(getAllJobs)

router.route("/:jobId").get(getJobById)
router.route("/:jobId").put(verifyJwt, updateJob)
router.route("/:jobId").delete(verifyJwt, deleteJob)

export default router