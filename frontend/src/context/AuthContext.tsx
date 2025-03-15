"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  responseError: string;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const checkUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4500/api/v1/users/check",
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      await refresh();
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    try {
      await axios.post(
        "http://localhost:4500/api/v1/users/refresh",
        {},
        { withCredentials: true }
      );
      await checkUser();
    } catch (error) {
      setUser(null);

      const currentPath = window.location.pathname;
      if (currentPath === "/dashboard") {
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:4500/api/v1/users/signup",
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/login");
    } catch (error: any) {
      setUser(null);
      setError(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      setError("");
      const response = await axios.post(
        "http://localhost:4500/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      setUser(null);
      console.log(error);
      setError(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:4500/api/v1/users/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.log("Error logging out");
      console.log("here i have to show the messages from the backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        responseError: error,
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
