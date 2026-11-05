import { useEffect, useState } from "react";
import * as L from "../services/library";

// Re-renders the component whenever library data changes
export default function useLib() {
  const [, tick] = useState(0);
  useEffect(() => {
    const f = () => tick((n) => n + 1);
    window.addEventListener("lib:change", f);
    return () => window.removeEventListener("lib:change", f);
  }, []);
  return { users: L.getUsers(), books: L.getBooks(), tx: L.getTx(), notes: L.getNotes(), settings: L.getSettings() };
}
