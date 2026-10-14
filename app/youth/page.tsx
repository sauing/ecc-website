import TeamHeader from "../teams/team-header";
import s from "../membership/membership.module.css";

export const metadata = { title: "Youth | Eindhoven Cricket Club", description: "The new ECC youth page is coming soon." };

export default function YouthPage() {
  return <><TeamHeader /><main className={s.page}>
    <section className={s.hero}><div className={s.heroCopy}><span className={s.eyebrow}>The next generation</span><h1>YOUTH CRICKET</h1><p>A new chapter starts here.</p></div><img className={s.watermark} src="/images/ecc-logo.png" alt="" aria-hidden="true" /></section>
    <section className={s.content}><div className={s.placeholder}><span className={s.eyebrow}>Coming soon</span><h2>To be created</h2><p>We’re working on a dedicated home for youth cricket at ECC. More to come.</p><a className={s.back} href="/">Back to the club →</a></div></section>
  </main></>;
}
