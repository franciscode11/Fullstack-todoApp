"use client";
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

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

  const checkUser = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/check`,
        { withCredentials: true }
      );
      setUser(response.data.data.user);
      router.push("/dashboard");
    } catch (error: AxiosError | any) {
      await refresh();
    } finally {
      setLoading(false);
    }
  }, [router]);

  const refresh = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/refresh`,
        {},
        { withCredentials: true }
      );
      await checkUser();
    } catch (error: AxiosError | any) {
      setUser(null);

      const currentPath = window.location.pathname;
      if (currentPath === "/dashboard") {
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, [checkUser]);

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
    } catch (error: AxiosError | any) {
      setUser(null);
      setError(error?.response?.data?.message || "An error occurred");
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
    } catch (error: AxiosError | any) {
      setUser(null);
      setError(error?.response?.data?.message || "An error occurred");
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
    } catch (error: AxiosError | any) {
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
