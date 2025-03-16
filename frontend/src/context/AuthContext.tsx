"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
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

  const refresh = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/refresh`,
        {},
        { withCredentials: true }
      );
      await checkUser();
    } catch {
      setUser(null);
      const currentPath = window.location.pathname;
      if (currentPath === "/dashboard") {
        router.push("/login");
      }
    }
  };

  const checkUser = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/check`,
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch {
      await refresh();
    } finally {
      setLoading(false);
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/signup`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/login");
    } catch (err) {
      setUser(null);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      setError("");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch (err) {
      setUser(null);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      router.push("/login");
    } catch {
      setError("Something went wrong");
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
