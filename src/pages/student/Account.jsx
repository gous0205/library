import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/Auth";
import useLib from "../../hooks/useLib";
import { DAY, isOverdue, markRead } from "../../services/library";
import { fmt } from "../../utils/format";
import { Badge, Empty, PageHeader } from "../../components/common/ui";
import IdCard from "../../components/students/IdCard";
import TxTable from "../../components/transactions/TxTable";

export function MyBooks({ history }) {
  const { user } = useAuth(); const { tx } = useLib();
  const rows = tx.filter((t) => t.memberId === user.id && (history || !t.returnedAt)).sort((a, b) => b.issuedAt - a.issuedAt);
  return (<><PageHeader title={history ? "Borrowing History" : "My Borrowed Books"} sub={history ? "All your past and current loans" : "Return books by their due date"} />
    <div className="card p-2"><TxTable showStudent={false} rows={rows} /></div></>);
}

export function MyIdCard() {
  const { user } = useAuth();
  return (<><PageHeader title="My QR ID Card" sub="Show this QR code to the librarian when borrowing or returning" /><IdCard user={user} /></>);
}

export function Notifications() {
  const { user } = useAuth(); const { notes, tx, books } = useLib();
  useEffect(() => { markRead(user.id); }, []); // eslint-disable-line
  const mine = tx.filter((t) => t.memberId === user.id && !t.returnedAt);
  const alerts = mine.filter((t) => isOverdue(t) || t.dueAt - Date.now() <= 3 * DAY).map((t) => ({ id: "d" + t.id, over: isOverdue(t), text: `“${books.find((b) => b.id === t.bookId)?.title}” ${isOverdue(t) ? "is overdue since" : "is due on"} ${fmt(t.dueAt)}.` }));
  const all = [...alerts, ...notes.filter((n) => n.userId === user.id).map((n) => ({ id: n.id, text: n.message, at: n.at }))];
  return (<><PageHeader title="Notifications" sub="In-app alerts only. No email or SMS is sent in this version." />
    <div className="space-y-2">{all.length ? all.map((n) => (<div key={n.id} className="card flex items-start gap-3 !p-4"><Bell size={18} className={n.over ? "text-red-500" : "text-indigo-500"} />
      <div className="flex-1 text-sm">{n.text}</div>{n.over && <Badge tone="red">Overdue</Badge>}{n.at && <span className="text-xs text-slate-400">{fmt(n.at)}</span>}</div>)) : <Empty text="You have no notifications." />}</div></>);
}

export function Profile() {
  const { user } = useAuth();
  const rows = [["Full name", user.name], ["Roll number", user.roll], ["Member ID", user.id], ["College email", user.email], ["Department", user.dept], ["Year", user.year], ["Phone", user.phone], ["Member since", fmt(user.createdAt)]];
  return (<><PageHeader title="My Profile" /><div className="card max-w-lg"><dl className="space-y-3">{rows.map(([k, v]) => (<div key={k} className="flex justify-between gap-4 text-sm"><dt className="text-slate-500">{k}</dt><dd className="font-medium">{v}</dd></div>))}</dl></div></>);
}
