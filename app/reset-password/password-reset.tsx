"use client";

import { useState, type FormEvent } from "react";
import s from "../admin/admin.module.css";

export default function PasswordReset() {
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    const password = fields.get("password");
    if (password !== fields.get("confirmPassword")) {
      setError("The passwords do not match.");
      setBusy(false);
      return;
    }
    try {
      const response = await fetch("/auth/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Your password could not be updated.");
        return;
      }
      form.reset();
      setComplete(true);
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (complete) return <div className={s.form}><p role="status" className={s.success}>Your password has been updated.</p><a className={s.primary} href="/login">Continue to sign in →</a></div>;

  return <form className={s.form} onSubmit={submit}>
    <label className={s.field}>New password<input type={show ? "text" : "password"} name="password" autoComplete="new-password" required minLength={10} maxLength={1024} disabled={busy}/></label>
    <label className={s.field}>Confirm new password<input type={show ? "text" : "password"} name="confirmPassword" autoComplete="new-password" required minLength={10} maxLength={1024} disabled={busy}/></label>
    <button className={s.textButton} type="button" aria-pressed={show} onClick={() => setShow(!show)}>{show ? "Hide passwords" : "Show passwords"}</button>
    <p className={s.hint}>Use at least 10 characters. A longer, unique passphrase is best.</p>
    {error && <p role="alert" className={s.error}>{error}</p>}
    <button className={s.primary} disabled={busy}>{busy ? "Updating…" : "Set new password →"}</button>
  </form>;
}
