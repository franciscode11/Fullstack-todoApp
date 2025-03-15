import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "../src/utils/logger.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import todoRoutes from "./routes/todo.routes.js";

dotenv.config();

const app = express();
export { app };

// Security and general settings
app.use(helmet());
const allowedOrigins = [process.env.CORS_ORIGIN];
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));

// Requests limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter); //its applying for all the endpoints. If I want to change this i can make it work only for specific endpoitns like app.use("/api/v1/login", limiter);

// Logger settings
app.use(
  morgan((tokens, req, res) => {
    const logObject = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: tokens["response-time"](req, res) + "ms",
    };

    if (res.statusCode >= 400) {
      logger.error(JSON.stringify(logObject));
    } else {
      logger.info(JSON.stringify(logObject));
    }

    return null;
  })
);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/todos", todoRoutes);

// Error handler middlewares
app.use(errorHandler);
