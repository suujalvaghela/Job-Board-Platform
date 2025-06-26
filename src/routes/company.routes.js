import { Router } from "express";
import { createCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany } from "../controllers/company.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/").post(createCompany);
router.route("/").get(getAllCompanies)

router.route("/:companyId").get(getCompanyById)
router.route("/:companyId").put(verifyJwt, updateCompany)
router.route("/:companyId").delete(verifyJwt, deleteCompany)

export default router