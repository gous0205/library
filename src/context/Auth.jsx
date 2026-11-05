import { createContext, useContext, useState } from "react";
import useLib from "../hooks/useLib";
import { getUsers } from "../services/library";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// DEMO AUTH ONLY: localStorage is not secure. Use a real backend + hashed passwords in production.
export function AuthProvider({ children }) {
  const [id, setId] = useState(() => localStorage.getItem("library_session"));
  const { users } = useLib();
  const user = users.find((u) => u.id === id) || null;
  const login = (a, b) => {
    const [x, y] = [a.trim().toLowerCase(), b.trim().toLowerCase()];
    const u = getUsers().find((u) => (u.role === "admin" ? u.email.toLowerCase() === x && u.password === b.trim() : u.roll?.toLowerCase() === x && u.email.toLowerCase() === y));
    if (!u) throw new Error("Invalid credentials.");
    localStorage.setItem("library_session", u.id); setId(u.id);
  };
  const logout = () => { localStorage.removeItem("library_session"); setId(null); };
  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}
