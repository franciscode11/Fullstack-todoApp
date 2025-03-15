import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import {
  createTodo,
  toggleTodoCompleted,
  deleteTodo,
  editTodoText,
  getUserTodos,
} from "../controllers/todo.controllers.js";

const router = Router();

//routes
router.route("/create").post(verifyToken, createTodo);
router.route("/toggle").patch(verifyToken, toggleTodoCompleted);
router.route("/edit").patch(verifyToken, editTodoText);
router.route("/delete").post(verifyToken, deleteTodo);
router.route("/get").get(verifyToken, getUserTodos);
export default router;
