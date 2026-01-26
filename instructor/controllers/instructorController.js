import { Course } from "../models/course.js";
import { kafkaSend } from "./kafkaProducer.js";
import dbController from "./dbController.js";

const sendCourse = (res, courseData, method) => {
  try {
    const course = new Course(courseData, method);
    kafkaSend(course);
    return res.status(200).json({
      success: true,
      message: "Course event sent to Kafka successfully",
      data: { id: course.id, name: course.name }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to send course event",
      error: err.message
    });
  }
};

const deleteCourse = async (res, courseData) => {
  try {
    const result = await dbController.deleteCourse(courseData);
    if (result.success) {
      const course = new Course(courseData, "delete");
      kafkaSend(course);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: { id: courseData.id }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: result.message
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: err.message
    });
  }
};

export default { sendCourse, deleteCourse };
