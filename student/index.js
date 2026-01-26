import express from "express";

import { kafkaConsumer } from "./controllers/kafkaConsumer.js";
import router from "./routers/router.js";
import healthRouter from "./routers/health.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Health check routes
app.use("/", healthRouter);

const wait = () => {
  console.log("🔄 Initializing Kafka Consumer...");
  try {
    kafkaConsumer();
    console.log("✅ Kafka Consumer initialized successfully");
  } catch (err) {
    console.error("❌ Failed to initialize Kafka Consumer:", err);
  }
};

// Wait 5 seconds for Kafka to be ready
setTimeout(wait, 5000);

app.use(router);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
