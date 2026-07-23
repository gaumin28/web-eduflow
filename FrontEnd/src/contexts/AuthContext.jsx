/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import {
  login as loginApi,
  logout as logoutApi,
} from "../services/authService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const stored = localStorage.getItem("user");
    return token && stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const { data } = await loginApi(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutApi(); 
    } catch (err) {
      console.log(err);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };
  const updateUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser); // Kích hoạt React re-render giao diện ngay lập tức
  };
  const hasAnyRole = (roles) => roles.includes(user?.role);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasAnyRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
