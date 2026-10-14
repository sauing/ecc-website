import TeamHeader from "../teams/team-header";
import s from "./membership.module.css";

export const metadata = { title: "Membership | Eindhoven Cricket Club", description: "Explore ECC's senior, student, women, T20, practice and junior winter membership programmes." };

// Public catalogue reviewed on 15 October 2026. Dates are programme dates,
// not registration windows. Fees and availability require club confirmation.
const programmes = [
  { title: "Junior winter season (2026–2027) — Softball", tag: "Junior cricket · Saturday", description: "Winter indoor softball cricket. Saturdays, 2–4 pm at Gymzaal Vlokhovenseweg.", dates: "31 Oct 2026 – 20 Mar 2027", note: "Session dates follow the programme description supplied by the club. The old catalogue date field instead shows 28 Oct 2026 – 17 Mar 2027; the Saturday dates need club confirmation." },
  { title: "Junior winter season (2026–2027) — Leather ball", tag: "Junior cricket · Wednesday", description: "Winter indoor leather-ball cricket. Wednesdays, 6:30–8:30 pm at Indoor Sportcentrum Eindhoven.", dates: "28 Oct 2026 – 17 Mar 2027" },
  { title: "Senior annual membership", tag: "Senior cricket", description: "2026 KNCB season registration, including winter indoor practice for seniors.", dates: "4 Nov 2025 – 4 Nov 2026" },
  { title: "Student annual membership", tag: "Student cricket", description: "2026 KNCB season registration and winter indoor training.", dates: "4 Nov 2025 – 4 Nov 2026" },
  { title: "Women annual membership", tag: "Women’s cricket", description: "2026 KNCB season registration, winter indoor training and outdoor preparation.", dates: "4 Nov 2025 – 4 Nov 2026" },
  { title: "Lagere Klassen T20", tag: "T20 cricket", description: "The club’s listed Lagere Klassen T20 programme.", dates: "1 Jan – 30 Sep 2026" },
  { title: "Practice membership", tag: "Practice cricket", description: "The club’s listed practice membership programme.", dates: "1 Jan – 30 Sep 2026" },
];

export default function MembershipPage() {
  return <><TeamHeader /><main className={s.page}>
    <section className={s.hero}>
      <div className={s.heroCopy}><span className={s.eyebrow}>Your club. Your cricket.</span><h1>MEMBERSHIP</h1><p>Find your place at Eindhoven Cricket Club.</p></div>
      <img className={s.watermark} src="/images/ecc-logo.png" alt="" aria-hidden="true" />
    </section>
    <section className={s.content} aria-labelledby="programmes-heading">
      <div className={s.sectionHeading}><div><span className={s.eyebrow}>Registration programmes</span><h2 id="programmes-heading">Find your cricket at ECC.</h2></div><span className={s.season}>2026 · Winter 2026–27</span></div>
      <p className={s.notice}>Our new ECC registration service is being prepared. Explore senior programmes and junior winter cricket below. Listing a programme does not confirm current availability. Applications and payments are not yet available on this website.</p>
      <div className={s.grid}>{programmes.map((programme, index) => <article className={s.card} key={programme.title}>
        <div className={s.cardTop}><span>{programme.tag}</span><span className={s.number}>0{index + 1}</span></div>
        <h3>{programme.title}</h3><p>{programme.description}</p>
        <dl><dt>Programme dates</dt><dd>{programme.dates}</dd></dl>
        <details><summary>Registration information <span aria-hidden="true">+</span></summary>{programme.note && <p>{programme.note}</p>}<p>Fees, eligibility and registration availability will be confirmed before the new registration service opens. No application or payment is collected here yet.</p></details>
      </article>)}</div>
      <p className={s.source}>Programme information from the <a href="https://www.eindhovencc.com/registration" target="_blank" rel="noreferrer">existing ECC registration catalogue ↗</a> and club-supplied junior winter listings. Reviewed 15 October 2026.</p>
    </section>
  </main></>;
}
