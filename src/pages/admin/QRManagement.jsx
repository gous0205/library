import { useState } from "react";
import { Search, Share2 } from "lucide-react";
import useLib from "../../hooks/useLib";
import { findBook, findMember, link, saveSettings } from "../../services/library";
import { Badge, ErrorBox, Modal, PageHeader } from "../../components/common/ui";
import { QRCard } from "../../components/qr/QR";
import Scanner from "../../components/qr/Scanner";

const TABS = [["reg", "Registration QR"], ["students", "Student QR"], ["books", "Book QR"], ["scan", "Scan / Verify"]];

export default function QRManagement() {
  const { users, books, settings } = useLib();
  const [tab, setTab] = useState("reg"), [q, setQ] = useState(""), [sel, setSel] = useState(null), [found, setFound] = useState(null), [err, setErr] = useState("");
  const [base, setBase] = useState(settings.baseUrl), [msg, setMsg] = useState("");
  const regLink = link(settings, "/register");
  const local = /localhost|127\.0\.0\.1/.test(regLink);
  const share = async () => {
    try { navigator.share ? await navigator.share({ title: "Library registration", url: regLink }) : (await navigator.clipboard.writeText(regLink), setMsg("Link copied.")); } catch { /* cancelled */ }
  };
  const onScan = (t) => {
    const m = findMember(t), b = m ? null : findBook(t);
    setFound(m ? { kind: "Student", title: m.name, sub: `${m.roll} · ${m.dept} · ${m.id}` } : b ? { kind: "Book", title: b.title, sub: `${b.author} · ${b.id} · ${b.available}/${b.total} available` } : null);
    setErr(m || b ? "" : "Invalid QR: no matching student or book record.");
  };
  const list = tab === "students" ? users.filter((u) => u.role === "student").map((u) => ({ id: u.id, title: u.name, sub: `${u.roll} · ${u.id}`, path: `/s/${u.id}` }))
    : books.map((b) => ({ id: b.id, title: b.title, sub: `${b.author} · ${b.id}`, path: `/b/${b.id}` }));
  const rows = list.filter((r) => `${r.title} ${r.sub}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="QR Code Management" sub="QR codes contain only a link and a record ID, never personal data" />
      <div className="mb-4 flex gap-2 overflow-x-auto">{TABS.map(([k, l]) => <button key={k} className={tab === k ? "btn-primary" : "btn-ghost"} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === "reg" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card"><QRCard value={regLink} title="Student registration" sub={regLink} file="registration-qr"><button className="btn-ghost" onClick={share}><Share2 size={16} />Share</button></QRCard>{msg && <p className="mt-2 text-center text-sm text-emerald-600">{msg}</p>}</div>
          <div className="card space-y-3"><h2 className="font-semibold">Deployed website URL</h2>
            <p className="text-sm text-slate-500">The QR must point to your live site so students can open it on their phones.</p>
            {local && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">This QR currently points to localhost, which phones cannot open. Enter your deployed URL below (for example https://your-library.vercel.app).</p>}
            <input className="input" placeholder="https://your-site.example.com" value={base} onChange={(e) => setBase(e.target.value)} aria-label="Deployed URL" />
            <button className="btn-primary" onClick={() => saveSettings({ baseUrl: base.trim() })}>Save URL</button></div>
        </div>
      )}
      {(tab === "students" || tab === "books") && (
        <>
          <div className="relative mb-4"><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className="input pl-9" placeholder="Search generated QR codes" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{rows.map((r) => (
            <button key={r.id} className="card text-left transition hover:shadow-md" onClick={() => setSel(r)}><p className="truncate font-semibold">{r.title}</p><p className="truncate text-xs text-slate-500">{r.sub}</p><Badge tone="indigo">View QR</Badge></button>))}</div>
        </>
      )}
      {tab === "scan" && (
        <div className="card mx-auto max-w-md space-y-3"><Scanner label="Scan a QR code" onScan={onScan} placeholder="Student roll / member ID or book ID" /><ErrorBox>{err}</ErrorBox>
          {found && <div className="rounded-xl bg-emerald-50 p-3"><Badge tone="green">{found.kind} verified</Badge><p className="mt-1 font-semibold">{found.title}</p><p className="text-sm text-slate-600">{found.sub}</p></div>}</div>
      )}
      <Modal open={!!sel} onClose={() => setSel(null)} title="QR code">{sel && <QRCard value={link(settings, sel.path)} title={sel.title} sub={sel.id} file={`qr-${sel.id}`} />}</Modal>
    </>
  );
}
