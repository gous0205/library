import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import useLib from "../../hooks/useLib";
import { Badge, Cover, Empty, Modal, PageHeader, availTone } from "../../components/common/ui";

export default function Browse() {
  const { books } = useLib();
  const [q, setQ] = useState(""), [cat, setCat] = useState(""), [av, setAv] = useState(false), [sort, setSort] = useState("title"), [sel, setSel] = useState(null);
  const cats = [...new Set(books.map((b) => b.category))];
  const rows = useMemo(() => books.filter((b) => `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase()) && (!cat || b.category === cat) && (!av || b.available > 0))
    .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : sort === "year" ? b.year - a.year : b.available - a.available)), [books, q, cat, av, sort]);
  return (
    <>
      <PageHeader title="Browse Books" sub={`${rows.length} results`} />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative"><Search size={16} className="absolute left-3 top-3.5 text-slate-400" /><input className="input pl-9" placeholder="Search title or author" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
        <select className="input" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="title">Sort: Title A–Z</option><option value="year">Sort: Newest</option><option value="avail">Sort: Most available</option></select>
        <label className="input flex items-center gap-2"><input type="checkbox" checked={av} onChange={(e) => setAv(e.target.checked)} />Available only</label>
      </div>
      {rows.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{rows.map((b) => (
        <motion.div key={b.id} whileHover={{ y: -4 }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card space-y-2">
          <Cover book={b} /><p className="line-clamp-2 font-semibold">{b.title}</p><p className="text-sm text-slate-500">{b.author}</p>
          <div className="flex flex-wrap gap-1"><Badge tone="indigo">{b.category}</Badge><Badge tone={availTone(b)}>{b.available ? `${b.available} available` : "Unavailable"}</Badge></div>
          <p className="font-mono text-xs text-slate-400">ISBN {b.isbn}</p><button className="btn-ghost w-full" onClick={() => setSel(b)}>View details</button>
        </motion.div>))}</div> : <Empty text="No books match your filters." />}
      <Modal open={!!sel} onClose={() => setSel(null)} title={sel?.title}>{sel && <div className="space-y-3"><Cover book={sel} className="h-56" />
        <dl className="grid grid-cols-3 gap-y-1 text-sm"><dt className="text-slate-500">Author</dt><dd className="col-span-2">{sel.author}</dd><dt className="text-slate-500">Category</dt><dd className="col-span-2">{sel.category}</dd>
          <dt className="text-slate-500">Publisher</dt><dd className="col-span-2">{sel.publisher || "—"} ({sel.year || "—"})</dd><dt className="text-slate-500">ISBN</dt><dd className="col-span-2">{sel.isbn}</dd><dt className="text-slate-500">Book ID</dt><dd className="col-span-2 font-mono">{sel.id}</dd>
          <dt className="text-slate-500">Copies</dt><dd className="col-span-2">{sel.available} of {sel.total} available</dd></dl>
        <p className="rounded-xl bg-indigo-50 p-3 text-sm text-slate-600">To borrow this book, show your QR ID card at the library desk. The librarian confirms every issue.</p></div>}</Modal>
    </>
  );
}
