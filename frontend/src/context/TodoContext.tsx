"use client";

import React, {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from "react";

import axios from "axios";
import { AuthContext, User } from "./AuthContext";

export interface Todo {
  _id: string;
  user: User;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string;
  addTodo: (title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const TodoContext = createContext<TodoContextType | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const auth = useContext(AuthContext);
  const user = auth?.user;

  useEffect(() => {
    console.log("User:", user);
    if (user) {
      getTodos();
    }
  }, [user]);

  const addTodo = async (title: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/create`,
        { title },
        { withCredentials: true }
      );
      setError("");
      if (user) setTodos([response.data.data.todo, ...todos]);
    } catch (error: any) {
      setError(error?.response.data.message);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/delete`,
        {
          id,
        },
        { withCredentials: true }
      );
      setError("");
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error: any) {
      setError(error?.response.data.message);
    }
  };

  const editTodo = async (id: string, title: string) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/edit`,
        { id, title },
        { withCredentials: true }
      );
      setError("");
      setTodos(
        todos.map((todo) => {
          return todo._id === id ? { ...todo, title } : todo;
        })
      );
    } catch (error: any) {
      setError(error?.response.data.message);
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/toggle`,
        { id },
        { withCredentials: true }
      );
      setError("");
      setTodos(
        todos.map((todo) => (todo._id === id ? response.data.data.todo : todo))
      );
    } catch (error: any) {
      setError(error?.response.data.message);
    }
  };

  const getTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/todos/get`,
        { withCredentials: true }
      );
      setError("");
      const sortedTodos = response.data.data.userTodosArray.sort(
        (a: Todo, b: Todo) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTodos(sortedTodos);
    } catch (error: any) {
      setError(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        addTodo,
        deleteTodo,
        editTodo,
        toggleTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
