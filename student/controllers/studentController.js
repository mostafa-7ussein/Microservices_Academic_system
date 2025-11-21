
import sequelize from "sequelize";
import { Course } from "../models/course.js";

const db = new sequelize(process.env.POSTGRES_URL);

db.options.logging = (message) => {
  if (message.startsWith("Executing")) {
  } else {
    console.log(message);
  }
};

const CourseDB = db.define("course", {
  id: {
    type: sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: sequelize.STRING,
});


db.sync({ force: true });

const addCourse = async (courseData) => {
  try {
    const course = new Course(courseData);
    const result = await CourseDB.findByPk(course.id);
    if (!result) {
      await CourseDB.create({
        id: course.id,
        name: course.name,
      });
      console.log("Course added successfully");
    } else console.log("Course Id Already Exist");
  } catch (err) {
    console.log(err);
  }
};

const deleteCourse = async (courseData) => {
  try {
    const result = await CourseDB.findByPk(courseData.id);
    if (result) {
      await CourseDB.destroy({
        where: {
          id: courseData.id,
        },
      });
      console.log("Course deleted!");
    } else console.log("Course not found!");
  } catch (err) {
    console.log(err);
  }
};

const getCourse = async (courseData) => {
  return CourseDB.findByPk(courseData.id);
};

const getAllCourses = async () => {
  return CourseDB.findAll();
};
export default { addCourse, deleteCourse, getCourse, getAllCourses };
