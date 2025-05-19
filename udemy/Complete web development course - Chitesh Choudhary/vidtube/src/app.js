import express from "express";
import cors from "cors";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import { morganMiddleware } from "./loggers/logger.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

// Add Morgan middleware for HTTP request logging
// It should come early, but after static files if you don't want to log those.
// Place it before CORS if you want to see requests blocked by CORS.
// Place it after CORS if you only want to log successful CORS requests.
// Logging after CORS and before body parsing is common.
app.use(morganMiddleware);

// Common middleware
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/user", userRoutes);

app.use(errorHandler);
//

export default app;
