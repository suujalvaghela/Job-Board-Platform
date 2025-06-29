import { Router } from "express";
import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from "../controllers/company.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isRecruiterOrAdmin } from "../middlewares/role.middleware.js";

const router = Router()

router.route("/createcompany").post(verifyJwt, createCompany);
router.route("/getallcompanies").get(getAllCompanies)

router.route("/:companyId").get(getCompanyById)
router.route("/:companyId").put(verifyJwt, isRecruiterOrAdmin, updateCompany)
router.route("/:companyId").delete(verifyJwt, isRecruiterOrAdmin, deleteCompany)

export default router