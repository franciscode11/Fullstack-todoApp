"use client";

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

const Signup = () => {
  const auth = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() && !password.trim()) {
      setError("All fields are required");
      return;
    }
    if (!email.trim()) {
      setError("Email field is required");
      return;
    }
    if (!password.trim()) {
      setError("Password field is required");
      return;
    }

    if (auth) {
      await auth.signup(email, password);
    }
  };

  useEffect(() => {
    if (auth?.responseError && error !== auth.responseError) {
      setError(auth.responseError);
    }
  }, [auth?.responseError, error]);

  useEffect(() => {
    if (error !== auth?.responseError) return;
    setError("");
  }, [auth?.responseError, error]);

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center ">
      <div className=" text-gray-800 rounded-lg select-none">
        <div className="mb-6">
          <h1 className="text-2xl text-center mb-2 font-bold">
            Sign up for TodoApp
          </h1>
          <p
            className={`${
              error ? "text-red-500" : "text-gray-500"
            } text-center`}
          >
            {error ? error : "Welcome to TodoApp! Please sign up to continue"}
          </p>
        </div>
        <div>
          <form className="flex flex-col min-w-sm" onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className={`${
                error === "All fields are required" ||
                error === "Email field is required"
                  ? "text-red-600"
                  : "text-gray-800"
              } font-semibold mb-1`}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={`${
                error === "All fields are required" ||
                error === "Email field is required"
                  ? "border-red-600 border-2"
                  : "border-gray-800"
              } text-lg py-1 ps-4 w-sm rounded bg-transparent border border-gray-800 mb-4 focus:outline-1 outline-black`}
            />
            <label
              htmlFor="password"
              className={`${
                error === "All fields are required" ||
                error === "Password field is required"
                  ? "text-red-600"
                  : "text-gray-800"
              } font-semibold mb-1`}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className={`${
                error === "All fields are required" ||
                error === "Password field is required"
                  ? "border-red-600 border-2"
                  : "border-gray-800"
              } text-lg py-1 ps-4 w-sm rounded bg-transparent border border-gray-800 mb-10 focus:outline-1 outline-black`}
            />

            <button
              type="submit"
              disabled={auth?.loading}
              className="disabled:bg-gray-300 cursor-pointer bg-gray-950 text-white border-none py-2 rounded-md hover:bg-gray-900"
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="w-full text-center mt-8">
          <Link
            href={"/login"}
            className="w-full text-center px-2 hover:underline hover:text-black"
          >
            Already have an account? <span className="font-bold">Log in</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
