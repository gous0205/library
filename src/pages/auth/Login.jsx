import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Library, QrCode, BookMarked, BarChart3 } from "lucide-react";
import { useAuth } from "../../context/Auth";
import { ErrorBox } from "../../components/common/ui";

export default function Login() {
  const { user, login } = useAuth();
  const [a, setA] = useState(""), [b, setB] = useState(""), [err, setErr] = useState("");
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
  const submit = (e) => { e.preventDefault(); try { login(a, b); } catch (x) { setErr(x.message); } };
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-center bg-gradient-to-br from-navy to-indigo-600 p-12 text-white lg:flex">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Library size={44} className="mb-6 text-indigo-300" />
          <h1 className="text-4xl font-extrabold leading-tight">Your college library,<br />one scan away.</h1>
          <p className="mt-4 max-w-md text-indigo-100">Register with a QR code, borrow and return books in seconds, and track every transaction.</p>
          <ul className="mt-8 space-y-3 text-sm text-indigo-100">
            <li className="flex gap-3"><QrCode size={18} />QR registration and digital ID cards</li>
            <li className="flex gap-3"><BookMarked size={18} />Admin-confirmed issue and return</li>
            <li className="flex gap-3"><BarChart3 size={18} />Live inventory and overdue tracking</li>
          </ul>
        </motion.div>
      </div>
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-6">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <div><label className="label" htmlFor="a">Admin email or student roll number</label><input id="a" className="input" value={a} onChange={(e) => setA(e.target.value)} autoComplete="username" /></div>
          <div><label className="label" htmlFor="b">Admin password or student college email</label><input id="b" className="input" type="text" value={b} onChange={(e) => setB(e.target.value)} /></div>
          <ErrorBox>{err}</ErrorBox>
          <button className="btn-primary w-full">Sign in</button>
          <p className="text-center text-sm text-slate-500">New student? <Link className="font-semibold text-indigo-600" to="/register">Register</Link></p>
          <div className="rounded-xl bg-indigo-50 p-3 text-xs text-slate-600"><b>Demo logins</b><br />Admin: admin@college.edu / admin123<br />Student: 21CS001 / asha@college.edu</div>
        </form>
      </div>
    </div>
  );
}
