import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, QrCode, Search, Trash2 } from "lucide-react";
import useLib from "../../hooks/useLib";
import { deleteBook, link, saveBook } from "../../services/library";
import { Badge, Cover, ErrorBox, Modal, PageHeader, availTone } from "../../components/common/ui";
import { QRCard } from "../../components/qr/QR";

function BookForm({ book, onDone }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: book || { year: new Date().getFullYear(), total: 1, category: "" } });
  const [cover, setCover] = useState(book?.cover || ""), [err, setErr] = useState("");
  const pick = (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 400 * 1024) return setErr("Cover image must be under 400 KB.");
    const r = new FileReader(); r.onload = () => { setCover(r.result); setErr(""); }; r.readAsDataURL(f);
  };
  const submit = (d) => { try { saveBook({ ...book, ...d, cover }); onDone(); } catch (e) { setErr(e.message); } };
  const I = (label, name, o = {}, type = "text") => (
    <div><label className="label" htmlFor={name}>{label}</label><input id={name} type={type} className="input" {...register(name, o)} />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}</div>
  );
  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      {I("Title", "title", { required: "Required" })}{I("Author", "author", { required: "Required" })}
      <div className="grid gap-3 sm:grid-cols-2">{I("ISBN", "isbn", { required: "Required" })}{I("Category", "category", { required: "Required" })}
        {I("Publisher", "publisher")}{I("Publication year", "year", {}, "number")}{I("Total copies", "total", { required: "Required", min: { value: 1, message: "Min 1" } }, "number")}</div>
      <div><label className="label" htmlFor="cover">Cover image</label><input id="cover" type="file" accept="image/*" onChange={pick} className="input" />
        {cover && <img src={cover} alt="Cover preview" className="mt-2 h-24 rounded-lg" />}</div>
      <ErrorBox>{err}</ErrorBox><button className="btn-primary w-full">Save book</button>
    </form>
  );
}

export default function Books() {
  const { books, settings } = useLib();
  const [q, setQ] = useState(""), [edit, setEdit] = useState(null), [qr, setQr] = useState(null), [err, setErr] = useState("");
  const rows = books.filter((b) => `${b.title} ${b.author} ${b.isbn} ${b.id} ${b.category}`.toLowerCase().includes(q.toLowerCase()));
  const del = (b) => { if (!confirm(`Delete “${b.title}”?`)) return; try { deleteBook(b.id); setErr(""); } catch (e) { setErr(e.message); } };
  return (
    <>
      <PageHeader title="Manage Books" sub={`${books.length} titles`}><button className="btn-primary" onClick={() => setEdit({})}><Plus size={16} />Add book</button></PageHeader>
      <div className="relative mb-4"><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className="input pl-9" placeholder="Search title, author, ISBN, ID or category" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <ErrorBox>{err}</ErrorBox>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((b) => (
          <div key={b.id} className="card flex gap-3">
            <div className="w-24 shrink-0"><Cover book={b} className="h-32" /></div>
            <div className="min-w-0 flex-1"><p className="truncate font-semibold">{b.title}</p><p className="truncate text-sm text-slate-500">{b.author}</p>
              <p className="font-mono text-xs text-slate-400">{b.id} · {b.isbn}</p>
              <div className="my-2 flex flex-wrap gap-1"><Badge tone="indigo">{b.category}</Badge><Badge tone={availTone(b)}>{b.available}/{b.total} available</Badge></div>
              <div className="flex gap-1"><button className="btn-ghost !px-3" aria-label="QR code" onClick={() => setQr(b)}><QrCode size={16} /></button>
                <button className="btn-ghost !px-3" aria-label="Edit" onClick={() => setEdit(b)}><Pencil size={16} /></button>
                <button className="btn-danger !px-3" aria-label="Delete" onClick={() => del(b)}><Trash2 size={16} /></button></div></div>
          </div>
        ))}
      </div>
      <Modal open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? "Edit book" : "Add book"}>{edit && <BookForm book={edit.id ? edit : null} onDone={() => setEdit(null)} />}</Modal>
      <Modal open={!!qr} onClose={() => setQr(null)} title="Book QR code">{qr && <QRCard value={link(settings, `/b/${qr.id}`)} title={qr.title} sub={qr.id} file={`book-${qr.id}`} />}</Modal>
    </>
  );
}
