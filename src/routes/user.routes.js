import { Router } from "express";
import {
  registerUser,
  logInUser,
  logOutUser,
} from "../controllers/user.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields({
    name: "coverImage",
    maxCount: 1,
  }),
  registerUser
);
router.route("/login").post(logInUser);
router.route("/logout").post(verifyJwt, logOutUser);

export default router;
