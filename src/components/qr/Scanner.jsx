import { useEffect, useId, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CameraOff } from "lucide-react";

// Camera scanner with manual-entry fallback. Calls onScan(text) with the raw QR text / typed ID.
export default function Scanner({ onScan, label, placeholder = "Enter ID manually" }) {
  const id = "scan" + useId().replace(/:/g, "");
  const [on, setOn] = useState(false);
  const [err, setErr] = useState("");
  const [manual, setManual] = useState("");

  useEffect(() => {
    if (!on) return;
    const s = new Html5Qrcode(id);
    const p = s.start({ facingMode: "environment" }, { fps: 10, qrbox: 220 }, (t) => { setOn(false); onScan(t); }, () => {})
      .catch(() => { setErr("Camera unavailable or permission denied. Use manual entry below."); setOn(false); });
    return () => { p.then(() => s.stop()).then(() => s.clear()).catch(() => {}); };
  }, [on]); // eslint-disable-line

  return (
    <div className="space-y-3">
      {on && <div id={id} className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-black" />}
      <button className={on ? "btn-ghost w-full" : "btn-primary w-full"} onClick={() => { setErr(""); setOn(!on); }}>
        {on ? <><CameraOff size={18} />Stop camera</> : <><Camera size={18} />{label}</>}
      </button>
      {err && <p className="text-sm text-amber-600">{err}</p>}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (manual.trim()) { onScan(manual); setManual(""); } }}>
        <input className="input" value={manual} onChange={(e) => setManual(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
        <button className="btn-ghost">Go</button>
      </form>
    </div>
  );
}
