import express from "express";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree
} from "../controllers/category.controller";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategoryTree);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
