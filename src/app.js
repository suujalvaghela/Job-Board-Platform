import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js"
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js"

app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

export { app };
