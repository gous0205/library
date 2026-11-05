import { BookOpen, BookCheck, BookMarked, Users, AlertTriangle, UserPlus } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useLib from "../../hooks/useLib";
import { isOverdue } from "../../services/library";
import { PageHeader, Stat } from "../../components/common/ui";
import TxTable from "../../components/transactions/TxTable";

export default function Dashboard() {
  const { books, users, tx } = useLib();
  const students = users.filter((u) => u.role === "student");
  const today = new Date().toDateString();
  const byCat = Object.entries(books.reduce((a, b) => ({ ...a, [b.category]: (a[b.category] || 0) + b.total }), {})).map(([name, copies]) => ({ name, copies }));
  const recent = [...tx].sort((a, b) => b.issuedAt - a.issuedAt).slice(0, 6);
  return (
    <>
      <PageHeader title="Dashboard" sub="Live overview of the library" />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat icon={BookOpen} label="Total books (copies)" value={books.reduce((a, b) => a + b.total, 0)} />
        <Stat icon={BookCheck} label="Available books" value={books.reduce((a, b) => a + b.available, 0)} tone="green" />
        <Stat icon={BookMarked} label="Borrowed books" value={tx.filter((t) => !t.returnedAt).length} tone="orange" />
        <Stat icon={Users} label="Registered students" value={students.length} />
        <Stat icon={AlertTriangle} label="Overdue books" value={tx.filter(isOverdue).length} tone="red" />
        <Stat icon={UserPlus} label="Today's registrations" value={students.filter((s) => new Date(s.createdAt).toDateString() === today).length} tone="green" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card"><h2 className="mb-3 font-semibold">Copies by category</h2>
          <ResponsiveContainer width="100%" height={240}><BarChart data={byCat}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="copies" fill="#6366F1" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="card"><h2 className="mb-3 font-semibold">Recent transactions</h2><TxTable rows={recent} /></div>
      </div>
    </>
  );
}
