"use client";
import { useEffect, useRef, useState } from "react";
import s from "./login.module.css";

const plannedTools = [
  ["Membership programmes", "Add new membership types and manage their details."],
  ["Member directory", "View members and filter by membership type."],
  ["Payments", "View payment status and payment type for each membership."],
  ["Season squads", "Assign members to teams for a selected season, reflected on the public team page."],
  ["Complete memberships", "Complete a member’s registration through an admin workflow."],
];

export default function AdminLogin() {
  const [demo, setDemo] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus(); }, [demo]);
  return <main className={s.page}>
    <a className={s.back} href="/">← Back to public website</a>
    <section className={demo ? s.preview : s.card}>
      <img className={s.crest} src="/images/ecc-logo.png" alt="ECC crest" />
      <span className={s.eyebrow}>{demo ? "POC · Preview only" : "My ECC · Members & board"}</span>
      <h1 ref={title} tabIndex={-1}>{demo ? "Admin area — coming next." : "Welcome back."}</h1>
      {!demo ? <>
        <p>Your memberships, teams and cricket in one place. Board members will also have admin access. Public club pages need no login.</p>
        <button className={s.google} disabled>Continue with Google · Not connected</button>
        <a className={s.memberDemo} href="/my-ecc">Try demo member login →</a>
        <button className={s.primary} onClick={() => setDemo(true)}>Try demo admin login →</button>
        <small>No authentication or admin access is granted. This opens a preview only; no real member records are available.</small>
        <a className={s.publicLink} href="/">Just visiting? Explore ECC →</a>
      </> : <>
        <p>This is a public demo preview, not an authenticated admin session. Tournament management is available as an interactive demo; the other tools below are planned.</p>
        <a className={s.memberDemo} href="/tournaments/admin">Open tournament admin demo →</a>
        <div className={s.tools}>{plannedTools.map(([name, description]) => <article key={name}><span>Planned</span><h2>{name}</h2><p>{description}</p></article>)}</div>
        <p className={s.note}>Public team squads stay visible without login. Personal contact details, payment records and editing permissions will remain admin-only.</p>
        <button className={s.primary} onClick={() => setDemo(false)}>Exit demo preview</button>
      </>}
    </section>
  </main>;
}
