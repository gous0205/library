import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Library, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/Auth";

export default function Shell({ nav }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const side = (
    <div className="flex h-full flex-col bg-navy p-4 text-slate-300">
      <div className="mb-6 flex items-center gap-2 px-2 text-lg font-bold text-white"><Library className="text-indigo-400" />BookNest</div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${isActive ? "bg-indigo-500 text-white" : "hover:bg-white/10"}`}>
            <n.icon size={18} />{n.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/10 pt-3">
        <p className="truncate px-2 text-sm font-semibold text-white">{user.name}</p>
        <p className="px-2 pb-2 text-xs capitalize text-slate-400">{user.role}</p>
        <button className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm hover:bg-white/10" onClick={logout}><LogOut size={18} />Log out</button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{side}</aside>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy px-4 py-3 text-white lg:hidden">
        <span className="flex items-center gap-2 font-bold"><Library size={20} className="text-indigo-400" />BookNest</span>
        <button className="rounded-lg p-2" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 bg-navy/60 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="h-full w-72" initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }} transition={{ type: "tween", duration: 0.2 }} onClick={(e) => e.stopPropagation()}>
              <button className="absolute right-3 top-3 rounded-lg p-2 text-white" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>{side}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mx-auto max-w-6xl"><Outlet /></motion.div>
      </main>
    </div>
  );
}
