"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import API from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await API.get("/auth/profile");
          const fetchedUser = response.data.data;
          setUser(fetchedUser);
          Cookies.set("role", fetchedUser.role, { expires: 7 });
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          Cookies.remove("token");
          Cookies.remove("role");
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (token: string, userData: User) => {
    Cookies.set("token", token, { expires: 7 });
    Cookies.set("role", userData.role, { expires: 7 });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
