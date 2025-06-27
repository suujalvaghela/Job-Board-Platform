export const isRecruiterOrAdmin = (req, res, next) => {
    const { role } = req.user;

    if (role === "recruiter" || role === "admin") {
        return next();
    }

    return res
        .status(401)
        .json({
            success: false,
            message: "Access denied: Recruiter or Admin only.",
        });
};
