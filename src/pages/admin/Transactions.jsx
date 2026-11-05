import { useState } from "react";
import { Download, Search } from "lucide-react";
import useLib from "../../hooks/useLib";
import { isOverdue } from "../../services/library";
import { downloadText, fmt, toCSV } from "../../utils/format";
import { PageHeader } from "../../components/common/ui";
import TxTable, { txStatus } from "../../components/transactions/TxTable";

export default function Transactions({ overdue }) {
  const { tx, users, books } = useLib();
  const [q, setQ] = useState("");
  const name = (t) => users.find((u) => u.id === t.memberId)?.name || "", title = (t) => books.find((b) => b.id === t.bookId)?.title || "";
  const rows = tx.filter((t) => (!overdue || isOverdue(t)) && `${t.id} ${name(t)} ${title(t)}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.issuedAt - a.issuedAt);
  const csv = () => downloadText(overdue ? "overdue.csv" : "history.csv", toCSV([["Transaction", "Student", "Book", "Issued", "Due", "Returned", "Status"], ...rows.map((t) => [t.id, name(t), title(t), fmt(t.issuedAt), fmt(t.dueAt), fmt(t.returnedAt), txStatus(t)[0]])]), "text/csv");
  return (
    <>
      <PageHeader title={overdue ? "Overdue Books" : "Borrowing History"} sub={`${rows.length} records`}><button className="btn-ghost" onClick={csv}><Download size={16} />Export CSV</button></PageHeader>
      <div className="relative mb-4"><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className="input pl-9" placeholder="Search by student, book or transaction ID" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="card p-2"><TxTable rows={rows} /></div>
    </>
  );
}
