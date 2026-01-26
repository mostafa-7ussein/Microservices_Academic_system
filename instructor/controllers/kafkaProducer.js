import { KafkaClient, Producer } from "kafka-node";

const client = new KafkaClient({
  kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
});

const producer = new Producer(client);

export const kafkaProducer = async (app) => {
  producer.on("ready", async () => {
    console.log("✅ Kafka Producer is ready");
    kafkaSend({ message: "topic created" });
  });

  producer.on("error", (err) => {
    console.error("❌ Kafka producer error:", err);
  });
};

export function kafkaSend(message) {

  console.log(`📤 Sending message to Kafka topic '${process.env.KAFKA_TOPIC}':`, message);
  producer.send(
    [
      {
        topic: process.env.KAFKA_TOPIC,
        messages: JSON.stringify(message),
      },
    ],
    (err, data) => {
      if (err) {
        console.error("❌ Error sending message to Kafka:", err);
      } else {
        console.log("✅ Message sent to Kafka successfully");
      }
    }
  );
}

