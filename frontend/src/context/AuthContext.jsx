// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Load user + token from localStorage when app starts
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setAccessToken(storedToken);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", token);

    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


