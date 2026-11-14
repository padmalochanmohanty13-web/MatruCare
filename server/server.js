import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import {
  notFound,
  errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Robust CORS Middleware: Allows local dev, production domains (Vercel, Netlify, Render),
// and configured CLIENT_URL without throwing 500 errors.
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Always allow any incoming origin so that preview and deployed frontends connect seamlessly
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Root API Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to MatruCare AI API",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/hackathon", hackathonRoutes);
app.use("/api/contact", contactRoutes);

// Error Middleware (must come after routes)
app.use(notFound);
app.use(errorHandler);

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();

    app.locals.dbConnected = true;

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`MatruCare AI Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
