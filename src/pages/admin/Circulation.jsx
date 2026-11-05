import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import useLib from "../../hooks/useLib";
import { activeOf, findBook, findMember, isOverdue, issueBook, returnBook } from "../../services/library";
import { fmt } from "../../utils/format";
import { Badge, ErrorBox, PageHeader } from "../../components/common/ui";
import Scanner from "../../components/qr/Scanner";

// One component for both flows: scan student -> scan book -> admin confirms. A scan alone never changes data.
export default function Circulation({ mode }) {
  const { books } = useLib();
  const issue = mode === "issue";
  const [member, setMember] = useState(null), [book, setBook] = useState(null), [err, setErr] = useState(""), [done, setDone] = useState(null);
  const reset = () => { setMember(null); setBook(null); setErr(""); setDone(null); };
  const onMember = (t) => { const m = findMember(t); setErr(m ? "" : "This QR code does not match any registered student."); if (m) setMember(m); };
  const onBook = (t) => { const b = findBook(t); setErr(b ? "" : "This QR code does not match any book in the catalogue."); if (b) setBook(b); };
  const confirmTx = () => { try { setDone(issue ? issueBook(member.id, book.id) : returnBook(member.id, book.id)); setErr(""); } catch (e) { setErr(e.message); } };
  const active = member ? activeOf(member.id) : [];
  const fresh = book ? books.find((b) => b.id === book.id) : null;
  return (
    <>
      <PageHeader title={issue ? "Issue Books" : "Return Books"} sub="Step 1: scan student · Step 2: scan book · Step 3: confirm" />
      {done ? (
        <div className="card mx-auto max-w-md space-y-3 text-center"><CheckCircle2 className="mx-auto text-emerald-500" size={48} />
          <h2 className="text-xl font-bold">{issue ? "Book issued" : "Book returned"}</h2>
          <p className="text-sm text-slate-600">{book.title} — {member.name}</p>
          <p className="font-mono text-xs">{done.id}</p>
          <p className="text-sm">{issue ? `Due date: ${fmt(done.dueAt)}` : `Returned on: ${fmt(done.returnedAt)}`}</p>
          <button className="btn-primary w-full" onClick={reset}>Start another</button></div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card space-y-3"><h2 className="font-semibold">1. Student</h2>
            {member ? <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-sm"><p className="text-base font-semibold">{member.name}</p><p>{member.roll} · {member.dept}</p><p className="font-mono text-xs">{member.id}</p>
              <p>Borrowed now: <b>{active.length}</b> {active.some(isOverdue) && <Badge tone="red">{active.filter(isOverdue).length} overdue</Badge>}</p>
              {!issue && active.map((t) => <p key={t.id} className="text-xs text-slate-500">• {books.find((b) => b.id === t.bookId)?.title} (due {fmt(t.dueAt)})</p>)}
              <button className="text-xs font-semibold text-indigo-600" onClick={reset}>Change student</button></div>
              : <Scanner label="Scan student QR" onScan={onMember} placeholder="Roll number or member ID" />}</div>
          <div className={`card space-y-3 ${member ? "" : "opacity-50"}`}><h2 className="font-semibold">2. Book</h2>
            {!member ? <p className="text-sm text-slate-500">Scan the student first.</p> : book && fresh ? <div className="space-y-1 rounded-xl bg-slate-50 p-3 text-sm"><p className="text-base font-semibold">{fresh.title}</p><p>{fresh.author} · {fresh.category}</p><p className="font-mono text-xs">{fresh.id}</p>
              <Badge tone={fresh.available ? "green" : "red"}>{fresh.available}/{fresh.total} available</Badge>
              <div><button className="text-xs font-semibold text-indigo-600" onClick={() => setBook(null)}>Change book</button></div></div>
              : <Scanner label="Scan book QR" onScan={onBook} placeholder="Book ID or ISBN" />}</div>
          <div className="lg:col-span-2"><ErrorBox>{err}</ErrorBox>
            <button className="btn-primary mt-3 w-full sm:w-auto" disabled={!member || !book} onClick={confirmTx}>{issue ? "Confirm issue" : "Confirm return"}</button></div>
        </div>
      )}
    </>
  );
}
