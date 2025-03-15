import { Todo } from "../models/todo.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || user === "undefined") throw new ApiError(401, "Unauthorized");

  const { title } = req.body;
  if (!title.trim()) throw new ApiError(400, "Title is required");
  if (title.trim().length > 128)
    throw new ApiError(400, "Title cant be longer than 128 chars");

  const todo = await Todo.create({
    user: user._id,
    title,
    completed: false,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        todo: {
          _id: todo._id,
          title: todo.title,
          completed: todo.completed,
          user: todo.user,
          createdAt: todo.createdAt,
        },
      },
      "Todo created successfully"
    )
  );
});

const toggleTodoCompleted = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user || user === "undefined") throw new ApiError(401, "Unauthorized");

  const { id } = req.body;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new ApiError(400, "Valid todoId is required");
  }

  const todo = await Todo.findById({ _id: id });
  if (!todo) throw new ApiError(404, "todo not found");

  if (todo.user.toString() !== user._id.toString())
    throw new ApiError(401, "Unauthorized");

  todo.completed = !todo.completed;
  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { todo }, "Todo status toggled successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { id } = req.body;

  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Valid todoId is required");
  }

  const todo = await Todo.findById({ _id: id });
  if (!todo) throw new ApiError(404, "todo not found");

  if (todo.user.toString() !== user._id.toString())
    throw new ApiError(401, "Unauthorized");

  await Todo.findByIdAndDelete(id.trim());

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Todo deleted successfully"));
});

const editTodoText = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new ApiError(401, "Unauthorized");

  const { id, title } = req.body;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new ApiError(400, "Valid todoId is required");
  }

  if (!title.trim())
    throw new ApiError(400, "title is required in the endpoint");

  const todo = await Todo.findById({ _id: id });
  if (!todo) throw new ApiError(404, "todo not found");

  if (todo.user.toString() !== user._id.toString())
    throw new ApiError(401, "Unauthorized");

  todo.title = title;
  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { todo }, "todo title updated"));
});

const getUserTodos = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized");

    let userTodosArray = await Todo.find({ user: user._id });
    console.log("userTodos: ", userTodosArray);

    if (userTodosArray.length === 0) userTodosArray = [];

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userTodosArray },
          "user todos retrieved successfully"
        )
      );
  } catch (error) {
    console.log(error, "messi;wldw,");
  }
});

export {
  createTodo,
  toggleTodoCompleted,
  deleteTodo,
  editTodoText,
  getUserTodos,
};
