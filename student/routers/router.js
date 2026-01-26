import { Router } from "express";
import studentController from "../controllers/studentController.js";
import { getCourseSchema, validateQuery } from "../middleware/validation.js";

const router = Router();

router.get("/get-course", validateQuery(getCourseSchema), async (req, res) => {
  try {
    const course = await studentController.getCourse(req.query);
    if (course) {
      res.status(200).json({ success: true, data: course });
    } else {
      res.status(404).json({ success: false, message: "Course not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

router.get("/get-all-courses", async (req, res) => {
  try {
    const courses = await studentController.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
});

export default router;
