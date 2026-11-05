import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import useLib from "../../hooks/useLib";
import { backup, resetData, saveSettings } from "../../services/library";
import { downloadText } from "../../utils/format";
import { PageHeader } from "../../components/common/ui";

export default function Settings() {
  const { settings } = useLib();
  const [name, setName] = useState(settings.libraryName), [days, setDays] = useState(settings.loanDays), [msg, setMsg] = useState("");
  const save = (e) => { e.preventDefault(); const d = parseInt(days, 10); if (!name.trim() || !(d >= 1 && d <= 60)) return setMsg("Enter a name and a loan period of 1-60 days."); saveSettings({ libraryName: name.trim(), loanDays: d }); setMsg("Settings saved."); };
  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={save} className="card space-y-3"><div><label className="label" htmlFor="n">Library name</label><input id="n" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><label className="label" htmlFor="d">Loan period (days)</label><input id="d" type="number" className="input" value={days} onChange={(e) => setDays(e.target.value)} /></div>
          <p className="text-xs text-slate-500">Maximum active books per student: 3.</p>{msg && <p className="text-sm text-indigo-600">{msg}</p>}<button className="btn-primary">Save</button></form>
        <div className="card space-y-3"><h2 className="font-semibold">Data</h2>
          <button className="btn-ghost w-full" onClick={() => downloadText("library-backup.json", backup(), "application/json")}><Download size={16} />Export backup (JSON)</button>
          <button className="btn-danger w-full" onClick={() => confirm("Delete ALL data and restore demo data?") && resetData()}><RotateCcw size={16} />Reset to demo data</button>
          <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">Browser localStorage is not secure authentication and cannot protect data between users or devices. For production, use a backend with real authentication and a database.</p></div>
      </div>
    </>
  );
}
