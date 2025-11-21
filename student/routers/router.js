import { Router } from "express";
import studentController from "../controllers/studentController.js";

const router = Router();

router.get("/get-course", async (req, res) => {
  try {
    const course = await studentController.getCourse(req.body);
    res.status(200).json(course);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
router.get("/get-all-courses", async (req, res) => {
  try {
    const courses = await studentController.getAllCourses();
    res.status(200).json(courses);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

export default router;
