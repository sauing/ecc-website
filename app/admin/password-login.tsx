"use client";
import { useState, type FormEvent } from "react";
import s from "./admin.module.css";
export default function PasswordLogin() {
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    try {
      const response = await fetch("/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fields.get("email"), password: fields.get("password") }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error ?? "Sign-in could not be completed."); return; }
      form.reset(); window.location.assign("/login");
    } catch { setError("Could not connect. Please try again."); }
    finally { setBusy(false); }
  }
  return <form className={s.form} onSubmit={submit}>
    <label className={s.field}>Club email<input type="email" name="email" autoComplete="username" required maxLength={254} disabled={busy}/></label>
    <label className={s.field}>Password<input type={show ? "text" : "password"} name="password" autoComplete="current-password" required maxLength={1024} disabled={busy}/></label>
    <button className={s.textButton} type="button" aria-pressed={show} onClick={() => setShow(!show)}>{show ? "Hide password" : "Show password"}</button>
    {error && <p role="alert" className={s.error}>{error}</p>}
    <button className={s.primary} disabled={busy}>{busy ? "Signing in…" : "Sign in →"}</button>
    <p className={s.hint}>Forgot your password? Contact the website maintainer for an account reset.</p>
  </form>;
}
