import TeamHeader from "./team-header";
import s from "./season.module.css";

export default function TeamPageFrame({ label, name, description, children }: { label: string; name: string; description: string; children: React.ReactNode }) {
  const match = name.match(/^(.*?)(\d+)$/);
  return <main className={s.page}><TeamHeader/><section className={s.hero} aria-label={description}><div><span>{label}</span><h1>{match ? <>{match[1]}<em>{match[2]}</em></> : name}</h1><p>Season overview</p></div><img src="/images/ecc-logo.png" alt="" /></section>{children}</main>;
}
