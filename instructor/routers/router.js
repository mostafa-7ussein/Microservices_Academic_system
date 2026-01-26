import { Router } from "express";

import instructorController from "../controllers/instructorController.js";
import { addCourseSchema, deleteCourseSchema, validate } from "../middleware/validation.js";

const router = Router();

router.post("/add-course", validate(addCourseSchema), (req, res) => {
  return instructorController.sendCourse(res, req.body, "add");
});

router.delete("/delete-course", validate(deleteCourseSchema), async (req, res) => {
  return await instructorController.deleteCourse(res, req.body);
});

export default router;
