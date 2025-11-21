import router from "../routers/router.js";
import { KafkaClient, Producer } from "kafka-node";

const client = new KafkaClient({
  kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
});

const producer = new Producer(client);

export const kafkaProducer = async (app) => {
  producer.on("ready", async () => {
    console.log("producer ready");
    kafkaSend({ message: "topic created" });
    app.use(router);
  });
};

export function kafkaSend(message) {
  producer.send(
    [
      {
        topic: process.env.KAFKA_TOPIC,
        messages: JSON.stringify(message),
      },
    ],
    (err, data) => {
      if (err) console.log(err);
    }
  );
}

