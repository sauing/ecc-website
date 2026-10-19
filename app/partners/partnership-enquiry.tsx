"use client";

import { useState, type FormEvent } from "react";
import s from "./partners.module.css";

const opportunities = [
  { title: "Youth & development", description: "Support opportunities for young players to discover cricket, build confidence and grow together." },
  { title: "Matchdays & events", description: "Explore ways to be part of the matchdays and club events that bring players, families and supporters together." },
  { title: "Community partnerships", description: "Explore ideas that connect local businesses and people, and help make cricket accessible to more of our community." },
] as const;

export default function PartnershipEnquiry() {
  const [selected, setSelected] = useState(0);
  const [draft, setDraft] = useState<string | null>(null);

  function prepareEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `ECC partnership enquiry — ${opportunities[selected].title}`;
    const body = `Hello ECC,\n\nCompany: ${String(data.get("company")).trim()}\nReply email: ${String(data.get("email")).trim()}\nInterested in: ${opportunities[selected].title}\n\n${String(data.get("message")).trim()}\n`;
    setDraft(`mailto:info@eindhovencc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  }

  return <form className={s.enquiryForm} onSubmit={prepareEnquiry} onChange={() => setDraft(null)}>
    <div className={s.interests}>
      <fieldset className={s.choices}><legend className={s.srOnly}>Partnership interest</legend>{opportunities.map((opportunity, index) => <label className={s.choice} key={opportunity.title}><input type="radio" name="interest" value={opportunity.title} checked={selected === index} onChange={() => setSelected(index)} /><span>{opportunity.title}</span></label>)}</fieldset>
      <p className={s.opportunityDescription} aria-live="polite">{opportunities[selected].description}</p>
      <p className={s.approach}>We’ll explore the right approach together.</p>
    </div>
    <div className={s.formFields}>
      <label htmlFor="partner-company">Company name <span aria-hidden="true">*</span></label><input id="partner-company" name="company" autoComplete="organization" placeholder="Your company name" required maxLength={120} pattern=".*\S.*" />
      <label htmlFor="partner-email">Email address <span aria-hidden="true">*</span></label><input id="partner-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} />
      <label htmlFor="partner-message">Your message <span aria-hidden="true">*</span></label><textarea id="partner-message" name="message" rows={4} required maxLength={2000} placeholder="Tell us about your interest and how you’d like to get involved." />
      <button className={s.cta} type="submit">Start a conversation</button>
      <p className={s.formNote}>Prepares an email draft. You review and send it in your email app.</p>
      {draft && <div className={s.draft} role="status"><strong>Your enquiry is ready.</strong><p>Open the draft to review and send it. Your message hasn’t been sent yet.</p><a href={draft}>Open email draft</a></div>}
      <p className={s.directContact}>Or email us directly at <a href="mailto:info@eindhovencc.com">info@eindhovencc.com</a></p>
    </div>
  </form>;
}
