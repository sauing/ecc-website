import TeamHeader from "../teams/team-header";
import s from "./contact.module.css";
import ContactForm from "./contact-form";

export const metadata = { title: "Contacts | Eindhoven Cricket Club" };

// Public contact-page board widget, verified 15 October 2026.
// Club confirmed the two Shravan entries refer to the same person.
const board = [
  ["Ravi Patel", "Chairman", "chairman@eindhovencc.com"],
  ["Saurabh Singh", "Secretary (Club)", "vicechairman@eindhovencc.com"],
  ["Eindhoven Cricket Club (ECC)", "Legal Advisor", "info@eindhovencc.com"],
  ["Ankush Ghai", "Treasurer", "treasurer@eindhovencc.com"],
  ["Shrey Trehan", "Secretary (KNCB)", "secretary1@eindhovencc.com"],
  ["Shravan Parakala", "Facility Manager", "shravanparakala@gmail.com"],
];

export default function ContactPage() {
  return <><TeamHeader /><main className={s.page}>
    <section className={s.hero}><div className={s.heroCopy}><span className={s.eyebrow}>Let’s talk cricket</span><h1>CONTACTS</h1><div className={s.goldRule} /></div><img className={s.watermark} src="/images/ecc-logo.png" alt="" aria-hidden="true" /></section>
    <section className={s.content}>
      <div className={s.contactLayout}>
        <div className={s.details}>
          <h2>Come say hello.</h2><p className={s.intro}>We’d love to hear from you. Contact us, visit us at the club, or drop us an email.</p>
          <div className={s.contactRow}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 22s8-9 8-14a8 8 0 0 0-16 0c0 5 8 14 8 14Z"/><circle cx="12" cy="8" r="3"/></svg><div><h3>Visit us</h3><address>Locatellistraat 3<br />5654 JB Eindhoven<br />North Brabant, Netherlands</address></div></div>
          <div className={s.contactRow}><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16"/><path d="m2 5 10 8L22 5"/></svg><div><h3>Email us</h3><a href="mailto:info@eindhovencc.com">info@eindhovencc.com</a></div></div>
          <iframe className={s.map} title="ECC location — Locatellistraat 3, Eindhoven" src="https://maps.google.com/maps?q=Locatellistraat%203%205654%20JB%20Eindhoven&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <a className={s.directions} href="https://www.google.com/maps/search/?api=1&query=Locatellistraat+3+5654+JB+Eindhoven" target="_blank" rel="noreferrer">Get directions ↗</a>
        </div>
        <ContactForm />
      </div>
    </section>
    <section className={s.content} aria-labelledby="board-heading">
      <div className={s.sectionHeading}><div><span className={s.eyebrow}>The people behind ECC</span><h2 id="board-heading">Board of Directors</h2></div></div>
      <div className={s.grid}>{board.map(([name, role, email]) => <article className={s.card} key={name}><span className={s.role}>{role}</span><h3>{name}</h3><a href={`mailto:${email}`}>{email}</a></article>)}</div>
    </section>
  </main></>;
}
