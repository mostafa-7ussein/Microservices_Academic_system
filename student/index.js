import express from "express";

import { kafkaConsumer } from "./controllers/kafkaConsumer.js";
import router from "./routers/router.js";

const app = express();

app.use(express.json());

const wait = () => {
  kafkaConsumer();
};

setTimeout(wait, 5000);

app.use(router);

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
});
