"use client";

import { useContext, useEffect, useState } from "react";
import TaskItem from "@/components/TaskItem";
import { AuthContext } from "@/context/AuthContext";
import { TodoContext, Todo } from "@/context/TodoContext";

export default function Dashboard() {
  const [title, setTitle] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>();
  const [error, setError] = useState<string>("");

  //LOGOUT logic
  const auth = useContext(AuthContext);
  const onLogout = async () => {
    if (auth) {
      await auth.logout();
    }
  };

  //TODOS logic
  const todoGlobals = useContext(TodoContext);

  useEffect(() => {
    if (todoGlobals?.todos) setTodos(todoGlobals?.todos);
    if (todoGlobals?.error) setError(todoGlobals?.error);
  }, [todoGlobals?.todos]);

  //save a new todo
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      return;
    }

    if (todoGlobals) {
      await todoGlobals.addTodo(title);
    }

    setTitle("");
  };

  //Just development...
  useEffect(() => {
    console.log("Todos:", todos);
  }, [todos]);

  return (
    <div className="flex flex-col items-center bg-gray-800 min-h-screen text-white">
      <header className="w-full flex justify-end mt-2 mr-4">
        <button
          onClick={onLogout}
          className="bg-red-600 cursor-pointer transition-colors duration-200 text-white rounded py-1 px-2 hover:bg-red-700"
        >
          <img src="logout.svg" alt="" className="h-5" />
        </button>
      </header>
      <div className="flex flex-col gap-5 mt-2">
        <div>
          <form className="flex justify-between  gap-4" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="write a new task..."
              className="border-2 border-gray-500 focus:border-2 focus:border-white rounded ps-5 py-2 text-xl sm:w-md md:w-lg focus:outline-0
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={todoGlobals?.loading}
            />
            <button
              className="px-6 rounded flex items-center justify-center bg-indigo-500 text-lg font-semibold cursor-pointer transition-colors duration-200 hover:bg-indigo-600"
              disabled={todoGlobals?.loading}
            >
              add
            </button>
          </form>
        </div>
        {todoGlobals?.loading ? (
          <p className="text-center text-lg font-semibold">Loading...</p>
        ) : error ? (
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        ) : (
          <div id="tasks-container">
            {todos?.map((todo: Todo) => (
              <TaskItem
                key={todo._id}
                todo={todo}
                onDelete={todoGlobals?.deleteTodo}
                onEdit={todoGlobals?.editTodo}
                onComplete={todoGlobals?.toggleTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
