import { KafkaClient, Consumer } from "kafka-node";
import studentController from "./studentController.js";

export const kafkaConsumer = () => {
  const client = new KafkaClient({
    kafkaHost: process.env.KAFKA_BOOTSTRAP_SERVERS,
  });

  const consumer = new Consumer(client, [{ topic: process.env.KAFKA_TOPIC }], {
    autoCommit: false,
  });

  consumer.on("message", async (message) => {
    try {
      const courseData = JSON.parse(message.value);
      console.log("📨 Received message from Kafka:", courseData);
      
      if (courseData.method === "add") {
        console.log("➕ Processing add course:", courseData);
        await studentController.addCourse(courseData);
        console.log("✅ Course added successfully");
      } else if (courseData.method === "delete") {
        console.log("➖ Processing delete course:", courseData);
        await studentController.deleteCourse(courseData);
        console.log("✅ Course deleted successfully");
      } else {
        console.log("⚠️ Unknown method:", courseData.method);
      }
    } catch (err) {
      console.error("❌ Error processing Kafka message:", err);
    }
  });

  consumer.on("error", (err) => {
    console.log(err);
  });
};

