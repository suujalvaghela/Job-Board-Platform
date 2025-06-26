import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Company } from "../models/company.models.js";

const createCompany = asyncHandler(async (req, res) => {
    const { name, description, logo, website } = req.body
    if ([name, description, logo, website].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, "all field must be required")
    }

    const existing = await Company.findOne({
        $or: [{ name }, { logo }, { website }],
    });

    if (existing) {
        throw new ApiError(400, "Company with same name/logo/website already exists");
    }

    const newCompany = await Job.create({
        title,
        description,
        logo,
        website,
        user: req.user._id
    });

    if (!newCompany) {
        throw new ApiError(501, "company not created")
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createCompany, "Company created successfully"))

})

const getAllCompanies = asyncHandler(async (req, res) => {
    const companies = await Company.find().populate("user", "fullName email");

    if (!companies || companies.length === 0) {
        throw new ApiError(404, "No companies found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, companies, "Companies fetched successfully"));
})

const getCompanyById = asyncHandler(async (req, res) => {
    const { companyId } = req.params

    const company = await Company.findById(companyId).populate("user", "fullName , email")

    if (!company) {
        throw new ApiError(401, "company does not exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(201, company, "Company got find"))
})

const updateCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    if (company.user.toString() !== req.user._id.toString()) {
        throw new ApiError(401, "Unauthorized Access!!")
    }

    const updates = req.body

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updates, {
        new: true,
    })

    if (!updatedCompany) {
        throw new ApiError(501, "Company not updated yet")
    }

    return res
        .status(201)
        .json(new ApiResponse(200, updatedCompany, "Company is updated successfully!"))
})

const deleteCompany = asyncHandler(async (req, res) => {

    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
        throw new ApiError(404, "Company not found");
    }

    if (company.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this company");
    }

    const deletedCompany = await company.deleteOne();

    if (!deletedCompany) {
        throw new ApiError(501, "Company not deleted")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedCompany, "Company deleted successfully"));
})

export {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
}