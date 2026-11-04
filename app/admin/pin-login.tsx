"use client";
import { useEffect, useState, type FormEvent } from "react";
import s from "./admin.module.css";
export default function PinLogin() {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { let active = true; fetch("/auth/pin", { cache: "no-store" }).then(response => response.ok ? response.json() : null).then(value => { if (active) setAvailable(value?.available === true); }).catch(() => {}); return () => { active = false; }; }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/auth/pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "login", pin: new FormData(form).get("pin") }) });
      const result = await response.json();
      form.reset();
      if (!response.ok) { setError(result.error ?? "PIN not accepted. Use your password."); return; }
      window.location.assign("/admin");
    } catch { setError("Could not connect. Please try again or use your password."); }
    finally { setBusy(false); }
  }
  if (!available) return null;
  return <div className={s.pinSection}>
    <button type="button" className={s.secondaryLogin} aria-expanded={open} onClick={() => setOpen(!open)}>Use my ECC PIN</button>
    {open && <form className={s.form} onSubmit={submit}><p>Quick login for this approved browser.</p><label className={s.field}>Six-digit ECC PIN<input type="password" name="pin" inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" minLength={6} maxLength={6} required disabled={busy}/></label>{error && <p role="alert" className={s.error}>{error}</p>}<button className={s.primary} disabled={busy}>{busy ? "Signing in…" : "Sign in with PIN →"}</button></form>}
  </div>;
}
