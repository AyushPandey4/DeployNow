"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext({
  user: null,
  getUser: () => null,
  logout: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Loads user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // getUser: returns user from state or localStorage
  const getUser = useCallback(() => {
    if (user) return user;
    const storedUser = localStorage.getItem("user");
    if (storedUser) return JSON.parse(storedUser);
    return null;
  }, [user]);

  // logout: removes user and token from localStorage and state
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, getUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 