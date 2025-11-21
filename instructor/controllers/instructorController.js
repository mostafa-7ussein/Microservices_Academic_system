import { Course } from "../models/course.js";

import { kafkaSend } from "./kafkaProducer.js";

const sendCourse = (res, courseData, method) => {
  try {
    const course = new Course(courseData, method);
    kafkaSend(course);
    return res.status(200).json("message sent");
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

export default { sendCourse };
