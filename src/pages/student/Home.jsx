import { BookMarked, Clock, AlertTriangle, BookCheck } from "lucide-react";
import useLib from "../../hooks/useLib";
import { useAuth } from "../../context/Auth";
import { DAY, isOverdue } from "../../services/library";
import { PageHeader, Stat } from "../../components/common/ui";
import TxTable from "../../components/transactions/TxTable";

export default function Home() {
  const { user } = useAuth(); const { tx, books } = useLib();
  const mine = tx.filter((t) => t.memberId === user.id), active = mine.filter((t) => !t.returnedAt);
  const soon = active.filter((t) => !isOverdue(t) && t.dueAt - Date.now() <= 3 * DAY);
  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(" ")[0]}`} sub={`${user.dept} · ${user.roll}`} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={BookMarked} label="Currently borrowed" value={`${active.length}/3`} />
        <Stat icon={Clock} label="Due within 3 days" value={soon.length} tone="orange" />
        <Stat icon={AlertTriangle} label="Overdue" value={active.filter(isOverdue).length} tone="red" />
        <Stat icon={BookCheck} label="Titles available" value={books.filter((b) => b.available > 0).length} tone="green" />
      </div>
      <div className="card"><h2 className="mb-3 font-semibold">Recently borrowed</h2><TxTable showStudent={false} rows={[...mine].sort((a, b) => b.issuedAt - a.issuedAt).slice(0, 5)} /></div>
    </>
  );
}
