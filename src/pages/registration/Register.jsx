import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Library } from "lucide-react";
import { registerStudent } from "../../services/library";
import { ErrorBox } from "../../components/common/ui";
import IdCard from "../../components/students/IdCard";

const DEPTS = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Business Administration", "Other"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function F({ label, name, opts, type = "text", rules, register, errors }) {
  return (
    <div><label className="label" htmlFor={name}>{label}</label>
      {opts ? <select id={name} className="input" {...register(name, { required: "Required" })}><option value="">Select…</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
        : <input id={name} className="input" type={type} autoComplete="off" {...register(name, { required: "Required", ...rules })} />}
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>}</div>
  );
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setErr] = useState(""), [done, setDone] = useState(null);
  const submit = (d) => { try { setDone(registerStudent(d)); } catch (e) { setErr(e.message); } };
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center p-4">
      <div className="mb-4 flex items-center gap-2 text-lg font-bold"><Library className="text-indigo-500" />Library Registration</div>
      {done ? (
        <div className="card space-y-4"><h1 className="text-xl font-bold">You are registered!</h1>
          <p className="text-sm text-slate-500">Download your ID card and show its QR code at the library desk.</p>
          <IdCard user={done} /><Link className="btn-ghost w-full" to="/login">Go to sign in</Link></div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="card space-y-3">
          <F register={register} errors={errors} label="Full name" name="name" /><F register={register} errors={errors} label="Student ID / Roll number" name="roll" />
          <F register={register} errors={errors} label="College email" name="email" type="email" rules={{ pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } }} />
          <div className="grid gap-3 sm:grid-cols-2"><F register={register} errors={errors} label="Department" name="dept" opts={DEPTS} /><F register={register} errors={errors} label="Year of study" name="year" opts={YEARS} /></div>
          <F register={register} errors={errors} label="Phone number" name="phone" type="tel" rules={{ pattern: { value: /^\d{10}$/, message: "Enter 10 digits" } }} />
          <ErrorBox>{err}</ErrorBox>
          <button className="btn-primary w-full">Register</button>
          <p className="text-center text-sm text-slate-500">Already registered? <Link className="font-semibold text-indigo-600" to="/login">Sign in</Link></p>
        </form>
      )}
    </div>
  );
}
