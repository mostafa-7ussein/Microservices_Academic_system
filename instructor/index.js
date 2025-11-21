import express from "express";
import { kafkaProducer } from "./controllers/kafkaProducer.js";

const app = express();

app.use(express.json());

kafkaProducer(app);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
