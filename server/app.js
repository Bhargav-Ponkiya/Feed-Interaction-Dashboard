require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// Security packages
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

// Utility packages
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// DB connection
const connectDB = require("./db/connect");

// Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const feedRouter = require("./routes/feedRoutes");

///////////////////////////
// Security Middleware
app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 1000 }));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ frontend origin (no *)
    credentials: true, // ✅ allow cookies/auth headers
  })
);
///////////////////////////

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

///////////////////////////
// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/feed", feedRouter);
///////////////////////////

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server Start
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`🚀 Server running on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

start();
