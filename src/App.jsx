import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AlertTriangle, Bell, BookMarked, BookOpen, CreditCard, History, LayoutDashboard, QrCode, Settings as Cog, Undo2, User, Users } from "lucide-react";
import { useAuth } from "./context/Auth";
import Shell from "./components/layout/Shell";
import Login from "./pages/auth/Login";
import Register from "./pages/registration/Register";
import Dashboard from "./pages/admin/Dashboard";
import Books from "./pages/admin/Books";
import Students from "./pages/admin/Students";
import QRManagement from "./pages/admin/QRManagement";
import Circulation from "./pages/admin/Circulation";
import Transactions from "./pages/admin/Transactions";
import Settings from "./pages/admin/Settings";
import Home from "./pages/student/Home";
import Browse from "./pages/student/Browse";
import { MyBooks, MyIdCard, Notifications, Profile } from "./pages/student/Account";

const ADMIN = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }, { to: "/admin/books", label: "Manage Books", icon: BookOpen },
  { to: "/admin/students", label: "Manage Students", icon: Users }, { to: "/admin/qr", label: "QR Code Management", icon: QrCode },
  { to: "/admin/issue", label: "Issue Books", icon: BookMarked }, { to: "/admin/return", label: "Return Books", icon: Undo2 },
  { to: "/admin/history", label: "Borrowing History", icon: History }, { to: "/admin/overdue", label: "Overdue Books", icon: AlertTriangle },
  { to: "/admin/settings", label: "Settings", icon: Cog },
];
const STUDENT = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true }, { to: "/student/browse", label: "Browse Books", icon: BookOpen },
  { to: "/student/borrowed", label: "My Borrowed Books", icon: BookMarked }, { to: "/student/id", label: "My QR ID Card", icon: CreditCard },
  { to: "/student/history", label: "Borrowing History", icon: History }, { to: "/student/notifications", label: "Notifications", icon: Bell },
  { to: "/student/profile", label: "My Profile", icon: User },
];

// Role-based route guard (UI-level only; localStorage cannot enforce real security)
function Guard({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Guard role="admin"><Shell nav={ADMIN} /></Guard>}>
          <Route index element={<Dashboard />} /><Route path="books" element={<Books />} /><Route path="students" element={<Students />} />
          <Route path="qr" element={<QRManagement />} /><Route path="issue" element={<Circulation mode="issue" key="i" />} /><Route path="return" element={<Circulation mode="return" key="r" />} />
          <Route path="history" element={<Transactions />} /><Route path="overdue" element={<Transactions overdue />} /><Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/student" element={<Guard role="student"><Shell nav={STUDENT} /></Guard>}>
          <Route index element={<Home />} /><Route path="browse" element={<Browse />} /><Route path="borrowed" element={<MyBooks />} /><Route path="id" element={<MyIdCard />} />
          <Route path="history" element={<MyBooks history />} /><Route path="notifications" element={<Notifications />} /><Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/student") : "/login"} replace />} />
      </Routes>
    </HashRouter>
  );
}
