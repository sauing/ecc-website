"use client";
import { useState, type FormEvent } from "react";
import s from "./admin.module.css";
export default function PinSettings({ configured }: { configured: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function update(form: HTMLFormElement, action: "enroll" | "remove") {
    const fields = new FormData(form);
    if (!fields.get("password")) { setError("Enter your current password first."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/auth/pin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, password: fields.get("password"), pin: fields.get("pin"), confirmPin: fields.get("confirmPin") }) });
      const result = await response.json();
      form.reset();
      if (!response.ok) { setError(result.error ?? "Quick login could not be updated."); return; }
      setNotice(action === "enroll" ? "Your ECC PIN is ready on this browser for 30 days. You can use it after signing out." : "All your ECC PIN quick logins have been removed.");
    } catch { setError("Could not connect. Please try again."); }
    finally { setBusy(false); }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void update(event.currentTarget, "enroll"); }
  return <div className={s.pinSection}>
    <h2>Optional quick login</h2><p>Create your own six-digit ECC PIN on a private browser. It works for 30 days; five incorrect attempts disable it. Sign-in with your password always remains available.</p>
    {!configured ? <p>PIN setup is waiting for the maintainer to finish configuration.</p> : <form className={s.form} onSubmit={submit}>
      <label className={s.field}>Current password<input name="password" type="password" autoComplete="current-password" required maxLength={1024} disabled={busy}/></label>
      <div className={s.formGrid}><label className={s.field}>New ECC PIN<input name="pin" type="password" inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" minLength={6} maxLength={6} required disabled={busy}/></label><label className={s.field}>Confirm ECC PIN<input name="confirmPin" type="password" inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" minLength={6} maxLength={6} required disabled={busy}/></label></div>
      {error && <p role="alert" className={s.error}>{error}</p>}{notice && <p role="status" className={s.success}>{notice}</p>}
      <button className={s.primary} disabled={busy}>{busy ? "Please wait…" : "Save PIN on this browser"}</button>
      <button type="button" className={s.textButton} disabled={busy} onClick={event => { const form = event.currentTarget.form; if (form) void update(form, "remove"); }}>Remove all my ECC PIN quick logins</button>
      <p className={s.hint}>Signing out keeps the PIN available on approved browsers. Remove quick logins to forget those browsers. Only set up a PIN on a device you control.</p>
    </form>}
  </div>;
}
