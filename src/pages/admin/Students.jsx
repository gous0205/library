import { useState } from "react";
import { Search } from "lucide-react";
import useLib from "../../hooks/useLib";
import { activeOf } from "../../services/library";
import { fmt } from "../../utils/format";
import { Empty, Modal, PageHeader } from "../../components/common/ui";
import IdCard from "../../components/students/IdCard";

export default function Students() {
  const { users, tx } = useLib();
  const [q, setQ] = useState(""), [sel, setSel] = useState(null);
  const rows = users.filter((u) => u.role === "student" && `${u.name} ${u.roll} ${u.id} ${u.dept}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Manage Students" sub="Students register themselves using the registration QR code" />
      <div className="relative mb-4"><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className="input pl-9" placeholder="Search name, roll number, member ID" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="card overflow-x-auto p-0">
        {rows.length ? <table className="w-full"><thead><tr><th className="th">Name</th><th className="th">Roll</th><th className="th">Member ID</th><th className="th">Department</th><th className="th">Active</th><th className="th">Joined</th><th className="th"></th></tr></thead>
          <tbody>{rows.map((u) => (
            <tr key={u.id} className="border-t border-slate-100"><td className="td font-medium">{u.name}</td><td className="td">{u.roll}</td><td className="td font-mono text-xs">{u.id}</td><td className="td">{u.dept}</td>
              <td className="td">{activeOf(u.id).length}/3</td><td className="td">{fmt(u.createdAt)}</td><td className="td"><button className="btn-ghost !min-h-0 !py-1.5" onClick={() => setSel(u)}>ID card</button></td></tr>))}</tbody></table> : <Empty text="No students found." />}
      </div>
      <Modal open={!!sel} onClose={() => setSel(null)} title="Library ID card">{sel && <IdCard user={sel} />}</Modal>
    </>
  );
}
