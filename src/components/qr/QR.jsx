import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer } from "lucide-react";

export const useQR = (text, w = 320) => {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let ok = true;
    QRCode.toDataURL(text, { width: w, margin: 2, color: { dark: "#111827" } }).then((s) => ok && setSrc(s)).catch(() => ok && setSrc(""));
    return () => { ok = false; };
  }, [text, w]);
  return src;
};
export const saveImg = (src, name) => { const a = document.createElement("a"); a.href = src; a.download = `${name}.png`; a.click(); };
export const printImg = (src, title) => {
  const w = window.open("", "_blank"); if (!w) return;
  w.document.write('<title>Print QR</title><body style="font-family:sans-serif;text-align:center;padding:40px"></body>');
  const h = w.document.createElement("h2"); h.textContent = title;
  const i = w.document.createElement("img"); i.width = 320; i.onload = () => w.print(); i.src = src;
  w.document.body.append(h, i);
};

export function QRCard({ value, title, sub, file, children }) {
  const src = useQR(value);
  return (
    <div className="text-center">
      <div className="inline-block rounded-2xl border border-slate-200 bg-white p-3">
        {src ? <img src={src} alt={`QR code: ${title}`} className="h-56 w-56 sm:h-64 sm:w-64" /> : <div className="h-56 w-56 animate-pulse rounded-xl bg-slate-100 sm:h-64 sm:w-64" />}
      </div>
      <p className="mt-3 font-semibold">{title}</p>
      {sub && <p className="break-all text-xs text-slate-500">{sub}</p>}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <button className="btn-ghost" disabled={!src} onClick={() => saveImg(src, file)}><Download size={16} />PNG</button>
        <button className="btn-ghost" disabled={!src} onClick={() => printImg(src, title)}><Printer size={16} />Print</button>
        {children}
      </div>
    </div>
  );
}
