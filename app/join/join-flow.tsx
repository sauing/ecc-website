"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import s from "./join.module.css";

const memberships = [
  { name: "Senior annual membership", season: "2026", junior: false },
  { name: "Student annual membership", season: "2026", junior: false },
  { name: "Women annual membership", season: "2026", junior: false },
  { name: "Lagere Klassen T20", season: "2026", junior: false },
  { name: "Practice membership", season: "2026", junior: false },
  { name: "Junior winter — Softball (Saturday)", season: "2026–27", junior: true },
  { name: "Junior winter — Leather ball (Wednesday)", season: "2026–27", junior: true },
];
const initial = { name: "Alex Demo", address: "Example Street 10, 1234 AB Eindhoven", whatsapp: "+31 6 00000000", child: "", guardian: false, consent: false };
const steps = ["Sign in", "Your details", "Membership", "Demo checkout"];

export default function JoinFlow() {
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState(initial);
  const [selected, setSelected] = useState(0);
  const [outcome, setOutcome] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const member = memberships[selected];
  useEffect(() => { heading.current?.focus(); }, [step]);
  function next(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setOutcome(""); setStep(step + 1); }
  function restart() { setDetails(initial); setSelected(0); setOutcome(""); setStep(0); }
  return <main className={s.page}>
    <header className={s.header}><a href="/" className={s.brand}><img src="/images/ecc-logo.png" alt="ECC crest" /><span>Eindhoven Cricket Club</span></a><a href="/">Back to club ↗</a></header>
    <div className={s.banner}>POC DEMO · No real sign-in, payment, membership or email. Use sample details only.</div>
    <div className={s.layout}>
      <aside className={s.story}><span className={s.kicker}>Your next innings</span><h1>One club.<br />Your place.</h1><p>A simpler way to join Eindhoven Cricket Club.</p><img src="/images/ecc-logo.png" alt="" aria-hidden="true" /><ol>{steps.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined} data-complete={step > index}><span>{step > index ? "✓" : index + 1}</span>{label}</li>)}</ol><small>Prices and availability are to be confirmed. This walkthrough does not reserve a place.</small></aside>
      <section className={s.panel}>
        <span className={s.kicker}>{step === 4 ? "Demo complete" : `Step ${step + 1} of 4`}</span>
        <h2 ref={heading} tabIndex={-1}>{["Let’s get you started.", "Just the essentials.", "Choose your cricket.", "Review & try payment.", "Welcome to ECC — demo!"][step]}</h2>
        {step === 0 && <div><p>In the approved website, Google will provide your name and email. No extra password to remember.</p><button className={s.google} disabled>Continue with Google · Coming later</button><p className={s.hint}>Google authentication is not connected in this POC.</p><button className={s.primary} onClick={() => setStep(1)}>Try demo login →</button><p className={s.hint}>Uses Alex Demo · alex@example.com. Nothing is saved; refreshing resets this walkthrough.</p></div>}
        {step === 1 && <form onSubmit={next}><p>Confirm your name, address and WhatsApp number. For junior memberships, these are the parent or guardian’s details.</p>
          <label htmlFor="name">Full name<input id="name" required maxLength={100} pattern=".*\S.*" value={details.name} onChange={e => setDetails({...details, name:e.target.value})} /></label>
          <label>Email from demo account<input value="alex@example.com" readOnly type="email" /></label>
          <label htmlFor="address">Address<textarea id="address" required maxLength={300} value={details.address} onChange={e => setDetails({...details, address:e.target.value})} /></label>
          <label htmlFor="whatsapp">WhatsApp number<input id="whatsapp" type="tel" required pattern="\+?[0-9 ()-]{8,20}" maxLength={20} value={details.whatsapp} onChange={e => setDetails({...details, whatsapp:e.target.value})} /></label>
          <div className={s.actions}><button type="button" onClick={() => setStep(0)}>Back</button><button className={s.primary} disabled={!details.name.trim() || !details.address.trim()} type="submit">Choose membership →</button></div>
        </form>}
        {step === 2 && <form onSubmit={next}><fieldset><legend>Membership programmes · Fees to be confirmed</legend><div className={s.choices}>{memberships.map((option, index) => <label key={option.name} className={s.option}><input type="radio" name="membership" checked={selected === index} onChange={() => {setSelected(index); setDetails({...details, consent:false, guardian:false});}} /><span><strong>{option.name}</strong><small>Season {option.season} · Price TBC</small></span></label>)}</div></fieldset>
          {member.junior && <div className={s.junior}><label htmlFor="child">Junior player’s name<input id="child" required pattern=".*\S.*" maxLength={100} value={details.child} onChange={e => setDetails({...details, child:e.target.value})} /></label><label className={s.check}><input type="checkbox" required checked={details.guardian} onChange={e => setDetails({...details, guardian:e.target.checked})} />For this demo, I am acting as the player’s parent or guardian.</label></div>}
          <details className={s.policy}><summary>Demo consent information</summary><p>This is not a real application or legal acceptance of club rules. Approved club rules, privacy information and eligibility requirements will be provided before launch. No data is submitted, stored or emailed by this demo.</p></details>
          <label className={s.check}><input type="checkbox" required checked={details.consent} onChange={e => setDetails({...details, consent:e.target.checked})} />I understand this is only a demonstration, not a real registration.</label>
          <div className={s.actions}><button type="button" onClick={() => setStep(1)}>Back</button><button className={s.primary} type="submit">Review demo checkout →</button></div>
        </form>}
        {step === 3 && <div><dl className={s.summary}><dt>Member</dt><dd>{member.junior ? details.child : details.name}</dd>{member.junior && <><dt>Parent / guardian</dt><dd>{details.name}</dd></>}<dt>Address</dt><dd>{details.address}</dd><dt>WhatsApp</dt><dd>{details.whatsapp}</dd><dt>Membership</dt><dd>{member.name}</dd><dt>Season</dt><dd>{member.season}</dd><dt>Fee</dt><dd>To be confirmed</dd><dt>Charged in this demo</dt><dd>Nothing — no payment is taken</dd></dl><p className={s.hint}>No card or bank details required. Choose an outcome to test the payment journey.</p>{outcome && <p role="alert" className={s.feedback}>{outcome} No membership activated and no money charged. Try again or go back.</p>}<button className={s.primary} onClick={() => setStep(4)}>Simulate successful payment →</button><div className={s.actions}><button onClick={() => setOutcome("Demo payment failed.")}>Test failure</button><button onClick={() => setOutcome("Demo payment cancelled.")}>Test cancellation</button><button onClick={() => {setOutcome(""); setStep(2);}}>Edit details / membership</button></div></div>}
        {step === 4 && <div><span className={s.success}>DEMO MEMBERSHIP ACTIVE</span><p>The successful-payment journey is complete. No real membership was created and no email was sent.</p><article className={s.email}><span className={s.kicker}>Secretary email · Preview only</span><p><b>From:</b> ECC Secretary (sender address to be confirmed)<br /><b>To:</b> alex@example.com<br /><b>Subject:</b> Welcome to ECC — demo confirmation</p><hr /><p>Hello {details.name},</p><p>This preview shows confirmation for <b>{member.junior ? details.child : details.name}</b>: {member.name}, season {member.season}.</p><p>Demo status: active<br />Fee: to be confirmed<br />Payment: simulated, nothing charged</p><p>See you at the club,<br />ECC Secretary</p></article><p className={s.pending}><a href="/my-ecc">Explore the member dashboard demo →</a> This opens a separate sample profile, not the registration above.</p><div className={s.actions}><button className={s.primary} onClick={restart}>Try another registration</button><a href="/">Back to club →</a></div></div>}
      </section>
    </div>
  </main>;
}
