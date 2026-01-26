import { Router } from "express";
import sequelize from "sequelize";

const router = Router();

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    const health = {
      status: "healthy",
      service: "student-service",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || "1.0.0"
    };

    // Check database connection
    try {
      const db = new sequelize(process.env.POSTGRES_URL);
      await db.authenticate();
      health.database = "connected";
    } catch (dbError) {
      health.database = "disconnected";
      health.status = "degraded";
    }

    // Check Kafka connection (basic check)
    health.kafka = process.env.KAFKA_BOOTSTRAP_SERVERS ? "configured" : "not configured";

    const statusCode = health.status === "healthy" ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      service: "student-service",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Readiness check
router.get("/ready", async (req, res) => {
  try {
    // Check if database is accessible
    const db = new sequelize(process.env.POSTGRES_URL);
    await db.authenticate();
    
    res.status(200).json({
      status: "ready",
      service: "student-service",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      service: "student-service",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check
router.get("/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    service: "student-service",
    timestamp: new Date().toISOString()
  });
});

export default router;
