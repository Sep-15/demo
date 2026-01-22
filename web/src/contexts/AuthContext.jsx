import { useState, createContext, useMemo } from "react";
import { loginApi, registerApi } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (error) {
      localStorage.clear();
      return null;
    }
  });
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null,
  );
  const register = async (credentials) => {
    const { data } = await registerApi(credentials);
    if (!data?.token || !data?.user) {
      throw new Error("INVALID_LOGIN_RESPONSE");
    }
    const { user, token } = data;
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };
  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    if (!data?.token || !data?.user) {
      throw new Error("INVALID_LOGIN_RESPONSE");
    }
    const { user, token } = data;
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };
  const value = useMemo(
    () => ({ token, user, register, login, logout }),
    [token, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
