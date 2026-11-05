import useLib from "../../hooks/useLib";
import { isOverdue } from "../../services/library";
import { fmt } from "../../utils/format";
import { Badge, Empty } from "../common/ui";

export const txStatus = (t) => (t.returnedAt ? ["Returned", "green"] : isOverdue(t) ? ["Overdue", "red"] : ["Issued", "indigo"]);

export default function TxTable({ rows, showStudent = true }) {
  const { users, books } = useLib();
  if (!rows.length) return <Empty text="No records yet." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead><tr><th className="th">Txn ID</th>{showStudent && <th className="th">Student</th>}<th className="th">Book</th><th className="th">Issued</th><th className="th">Due</th><th className="th">Returned</th><th className="th">Status</th></tr></thead>
        <tbody>
          {rows.map((t) => { const [s, tone] = txStatus(t); return (
            <tr key={t.id} className="border-t border-slate-100">
              <td className="td font-mono text-xs">{t.id}</td>
              {showStudent && <td className="td">{users.find((u) => u.id === t.memberId)?.name || t.memberId}</td>}
              <td className="td">{books.find((b) => b.id === t.bookId)?.title || t.bookId}</td>
              <td className="td">{fmt(t.issuedAt)}</td><td className="td">{fmt(t.dueAt)}</td><td className="td">{fmt(t.returnedAt)}</td>
              <td className="td"><Badge tone={tone}>{s}</Badge></td>
            </tr>); })}
        </tbody>
      </table>
    </div>
  );
}
