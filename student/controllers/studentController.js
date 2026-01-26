import sequelize from "sequelize";
import { Course } from "../models/course.js";

let db = null;
let CourseDB = null;

const getDb = () => {
  if (!db) {
    db = new sequelize(process.env.POSTGRES_URL);
    
    db.options.logging = (message) => {
      if (message.startsWith("Executing")) {
      } else {
        console.log(message);
      }
    };

    CourseDB = db.define("course", {
      id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: sequelize.STRING,
    });
  }
  return { db, CourseDB };
};

const addCourse = async (courseData) => {
  try {
    const { db: dbInstance, CourseDB: CourseModel } = getDb();
    await dbInstance.sync();
    
    const course = new Course(courseData);
    console.log(`🔍 Checking if course ${course.id} exists...`);
    const result = await CourseModel.findByPk(course.id);
    if (!result) {
      await CourseModel.create({
        id: course.id,
        name: course.name,
      });
      console.log(`✅ Course added successfully: ID=${course.id}, Name=${course.name}`);
    } else {
      console.log(`⚠️ Course ID ${course.id} already exists. Skipping...`);
    }
  } catch (err) {
    console.error("❌ Error adding course:", err);
    throw err;
  }
};

const deleteCourse = async (courseData) => {
  try {
    const { db: dbInstance, CourseDB: CourseModel } = getDb();
    await dbInstance.sync();
    
    const result = await CourseModel.findByPk(courseData.id);
    if (result) {
      await CourseModel.destroy({
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
  try {
    const { db: dbInstance, CourseDB: CourseModel } = getDb();
    await dbInstance.sync();
    return await CourseModel.findByPk(courseData.id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllCourses = async () => {
  try {
    const { db: dbInstance, CourseDB: CourseModel } = getDb();
    await dbInstance.sync();
    return await CourseModel.findAll();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export default { addCourse, deleteCourse, getCourse, getAllCourses };
