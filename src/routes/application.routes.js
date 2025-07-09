import { Router } from "express";
import { applyForJob, getMyApplications, getApplicationsForJob, updateApplicationStatus } from "../controllers/application.controllers.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isRecruiterOrAdmin } from "../middlewares/role.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/:jobId/applyforjob").post(verifyJwt, upload.single("resume"), applyForJob)
router.route("/getmyapplication").get(verifyJwt, getMyApplications)
router.route("/:jobId").get(verifyJwt, isRecruiterOrAdmin, getApplicationsForJob)
router.route("/:id").put(verifyJwt, isRecruiterOrAdmin, updateApplicationStatus)

export default router