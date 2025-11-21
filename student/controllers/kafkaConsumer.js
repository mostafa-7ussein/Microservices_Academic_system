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
    const courseData = JSON.parse(message.value);
    console.log(courseData);
    if (courseData.method === "add") studentController.addCourse(courseData);
    else if (courseData.method === "delete")
      studentController.deleteCourse(courseData);
  });

  consumer.on("error", (err) => {
    console.log(err);
  });
};

