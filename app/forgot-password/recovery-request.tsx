"use client";

import { useState, type FormEvent } from "react";
import s from "../admin/admin.module.css";

export default function RecoveryRequest() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    const form = event.currentTarget;
    const fields = new FormData(form);
    try {
      const response = await fetch("/auth/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fields.get("email") }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "The reset email could not be sent.");
        return;
      }
      form.reset();
      setMessage(result.message);
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <form className={s.form} onSubmit={submit}>
    <label className={s.field}>Club email<input type="email" name="email" autoComplete="email" required maxLength={254} disabled={busy}/></label>
    {error && <p role="alert" className={s.error}>{error}</p>}
    {message && <p role="status" className={s.success}>{message}</p>}
    <button className={s.primary} disabled={busy}>{busy ? "Sending…" : "Email reset link →"}</button>
  </form>;
}
