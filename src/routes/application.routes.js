import { Router } from "express";
import { applyForJob, getMyApplications, getApplicationsForJob, updateApplicationStatus } from "../controllers/application.controllers.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isRecruiterOrAdmin } from "../middlewares/role.middleware.js"

const router = Router()

router.route("/applyforjob").post(verifyJwt, applyForJob)
router.route("/getmyapplication").get(verifyJwt, getMyApplications)
router.route("/:id").get(verifyJwt, isRecruiterOrAdmin, getApplicationsForJob)
router.route("/:id/status").put(verifyJwt, isRecruiterOrAdmin, updateApplicationStatus)

export default router