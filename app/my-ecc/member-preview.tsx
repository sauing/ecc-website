"use client";
import { useState } from "react";
import s from "./member.module.css";

const availability = "https://ecc-season-app.vercel.app/";
const sampleStats = { ODI: ["8", "246", "35.14", "6", "4"], T20: ["5", "118", "29.50", "3", "2"] };
export default function MemberPreview() {
  const [season, setSeason] = useState("2026");
  const [format, setFormat] = useState<"ODI" | "T20">("ODI");
  const [matches, setMatches] = useState<"Upcoming" | "Results">("Upcoming");
  const populated = season === "2026";
  return <main className={s.page}>
    <header className={s.header}><a href="/" className={s.brand}><img src="/images/ecc-logo.png" alt="ECC crest" />Eindhoven Cricket Club</a><div><a href="/">Public website ↗</a><a href="/login">Exit demo</a></div></header>
    <div className={s.notice}>MEMBER DEMO · Alex Demo is a fictional member. All memberships, assignments, stats and results below are sample data, not club records.</div>
    <div className={s.layout}>
      <aside className={s.sidebar}><div className={s.avatar}>AD</div><strong>Alex Demo</strong><span>Demo member</span><nav aria-label="Member sections"><a href="#overview">Overview</a><a href="#memberships">My memberships</a><a href="#teams">My teams</a><a href="#stats">My stats</a><a href="#matches">My matches</a><a href={availability} target="_blank" rel="noreferrer">Give availability ↗</a></nav></aside>
      <div className={s.content}>
        <section className={s.hero} id="overview"><div><span className={s.kicker}>Your club. Your cricket.</span><h1>Welcome back, Alex.</h1><p>Everything you need for your next innings.</p></div><img src="/images/ecc-logo.png" alt="" aria-hidden="true" /></section>
        <div className={s.toolbar}><span>MY ECC / OVERVIEW</span><label>Season <select value={season} onChange={e => setSeason(e.target.value)}><option>2026</option><option>2027</option></select></label></div>
        <div className={s.topGrid}>
          <section className={s.card} id="memberships"><span className={s.kicker}>01 / My memberships</span><h2>Your place at ECC.</h2>{populated ? <><span className={s.badge}>Active · Demo</span><h3>Senior annual membership</h3><dl><dt>Season</dt><dd>2026</dd><dt>Payment status</dt><dd>Paid — simulated</dd><dt>Payment type</dt><dd>Demo payment</dd><dt>Fee</dt><dd>To be confirmed</dd></dl></> : <p>No demo membership for 2027.</p>}<a className={s.textLink} href="/join">Explore registration demo →</a></section>
          <section className={s.card} id="teams"><span className={s.kicker}>02 / My teams</span><h2>Part of the squad.</h2>{populated ? <><div className={s.team}><strong>ECC<span>2</span></strong><div><b>Season 2026</b><p>ODI & T20 · Sample assignment</p></div></div><p>This shows how a season assignment will appear after an admin adds you to a squad.</p><a className={s.textLink} href="/teams/ecc2">View public ECC2 page ↗</a><small>The public team page contains existing club records, not this demo assignment.</small></> : <p>No team assigned in the 2027 demo.</p>}</section>
        </div>
        <section className={s.availability}><div><span className={s.kicker}>Make yourself available</span><h2>Ready for the next match?</h2><p>Open the ECC Season App to give your team availability. Separate sign-in may be required; no data is synced in this demo.</p></div><a href={availability} target="_blank" rel="noreferrer">Give availability ↗</a></section>
        <section className={s.card} id="stats"><div className={s.sectionHead}><div><span className={s.kicker}>03 / My stats · Sample data</span><h2>Your season in numbers.</h2></div><div className={s.toggle} role="group" aria-label="Statistics format">{(["ODI","T20"] as const).map(f => <button key={f} aria-pressed={format===f} onClick={() => setFormat(f)}>{f}</button>)}</div></div>{populated ? <div className={s.metrics}>{["Matches","Runs","Batting average","Wickets","Catches"].map((label,index) => <div key={label}><strong>{sampleStats[format][index]}</strong><span>{label}</span></div>)}</div> : <p>No sample statistics for 2027.</p>}</section>
        <section className={s.card} id="matches"><div className={s.sectionHead}><div><span className={s.kicker}>04 / My matches</span><h2>In the diary.</h2></div><div className={s.toggle} role="group" aria-label="Match list">{(["Upcoming","Results"] as const).map(tab => <button key={tab} aria-pressed={matches===tab} onClick={() => setMatches(tab)}>{tab}</button>)}</div></div>{!populated || matches === "Upcoming" ? <div className={s.empty}><h3>No upcoming matches in this demo.</h3><p>Team fixtures will appear here once member and season data are connected.</p></div> : <div className={s.results}><div><span>Sample match 01 · ODI</span><strong>ECC2 vs Demo XI</strong><b>Won · Example result</b></div><div><span>Sample match 02 · T20</span><strong>ECC2 vs Example CC</strong><b>Lost · Example result</b></div></div>}</section>
        <p className={s.footnote}>Preview only. Real Google login, member records, admin assignments and player-stat matching are not connected yet.</p>
      </div>
    </div>
  </main>;
}
