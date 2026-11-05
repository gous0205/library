import { AnimatePresence, motion } from "framer-motion";
import { Library, X } from "lucide-react";

const TONES = { slate: "bg-slate-100 text-slate-700", green: "bg-emerald-50 text-emerald-700", orange: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", indigo: "bg-indigo-50 text-indigo-700" };
export const Badge = ({ tone = "slate", children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone]}`}>{children}</span>
);

export const PageHeader = ({ title, sub, children }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div><h1 className="text-2xl font-bold tracking-tight">{title}</h1>{sub && <p className="text-sm text-slate-500">{sub}</p>}</div>
    <div className="flex flex-wrap gap-2">{children}</div>
  </div>
);

export const Stat = ({ icon: Icon, label, value, tone = "indigo" }) => (
  <motion.div whileHover={{ y: -3 }} className="card flex items-center gap-4">
    <div className={`rounded-xl p-3 ${TONES[tone]}`}><Icon size={22} /></div>
    <div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>
  </motion.div>
);

export const Empty = ({ text }) => <p className="py-10 text-center text-sm text-slate-500">{text}</p>;
export const ErrorBox = ({ children }) => children ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{children}</p> : null;

export function Modal({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2>
              <button className="rounded-lg p-2 hover:bg-slate-100" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Cover = ({ book, className = "h-40" }) =>
  book.cover ? <img src={book.cover} alt={`Cover of ${book.title}`} className={`${className} w-full rounded-xl object-cover`} />
    : <div className={`${className} flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-navy to-indigo-500 text-white/80`}><Library size={36} /></div>;

export const availTone = (b) => (b.available === 0 ? "red" : b.available <= 1 ? "orange" : "green");
