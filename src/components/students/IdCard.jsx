import { Download } from "lucide-react";
import useLib from "../../hooks/useLib";
import { link } from "../../services/library";
import { useQR } from "../qr/QR";
import { downloadCard } from "../../utils/card";

export default function IdCard({ user }) {
  const { settings } = useLib();
  const src = useQR(link(settings, `/s/${user.id}`), 240);
  return (
    <div className="space-y-3">
      <div className="flex max-w-md items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-navy to-indigo-600 p-5 text-white shadow-lg">
        <div className="min-w-0 space-y-1">
          <p className="text-xs uppercase tracking-widest text-indigo-200">{settings.libraryName}</p>
          <p className="truncate text-xl font-bold">{user.name}</p>
          <p className="text-sm text-indigo-100">Roll: {user.roll}</p>
          <p className="text-sm text-indigo-100">{user.dept} · {user.year}</p>
          <p className="pt-2 text-xs text-indigo-200">Member ID</p><p className="font-mono text-sm font-semibold">{user.id}</p>
        </div>
        {src && <img src={src} alt="Student QR code" className="h-28 w-28 shrink-0 rounded-xl bg-white p-1" />}
      </div>
      <button className="btn-primary" disabled={!src} onClick={() => downloadCard(user, src, settings.libraryName)}><Download size={16} />Download ID card</button>
    </div>
  );
}
