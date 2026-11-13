
import express from "express";

const router = express.Router();

// Backend health check
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Code-a-Nova API is working!",
  });
});

// Database connection status
router.get("/database", (req, res) => {
  res.status(200).json({
    success: true,
    database:
      req.app.locals.dbConnected ? "Connected" : "Disconnected",
  });
});

export default router;
