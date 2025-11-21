import { Router } from "express";

import instructorController from "../controllers/instructorController.js";

const router = Router();

router.post("/add-course", (req, res) => {
  return instructorController.sendCourse(res, req.body, "add");
});

router.delete("/delete-course", (req, res) => {
  return instructorController.sendCourse(res, req.body, "delete");
});

export default router;
