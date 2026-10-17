"use client";
import { useState } from "react";
import Image from "next/image";
import TeamHeader from "../teams/team-header";
import s from "./career-stats.module.css";

type Row = Record<string, string> & { player: string };
const columns = {
  batting: [["player","Player"],["matches","Matches"],["innings","Inns"],["notOut","NO"],["runs","Runs"],["highScore","HS"],["average","AVG"],["strikeRate","SR"],["hundreds","100s"],["fifties","50s"],["sixes","6s"],["fours","4s"],["minutes","Mins"]],
  bowling: [["player","Player"],["matches","Matches"],["overs","Overs"],["runsConceded","Runs"],["wickets","Wickets"],["best","Best"],["bowlingAverage","AVG"],["economy","Econ"],["bowlingStrikeRate","SR"],["maidens","Maidens"],["five","5W"]],
  fielding: [["player","Player"],["matches","Matches"],["catches","Catches"],["wicketkeeperCatches","WK catches"],["stumpings","Stumpings"],["runOutsAssisted","Run outs (A)"],["runOutsUnassisted","Run outs (U)"]],
};
const name = (value: string) => value.includes(",") ? value.split(",").reverse().map(x => x.trim()).join(" ") : value;
export default function CareerStats({odi,t20}:{odi:Row[];t20:Row[]}) {
  const [format,setFormat] = useState<"odi"|"t20">("odi");
  const [tab,setTab] = useState<keyof typeof columns>("batting");
  const [query,setQuery] = useState("");
  const [sort,setSort] = useState("runs");
  const [desc,setDesc] = useState(true);
  const rows = format === "odi" ? odi : t20;
  const visible = rows.filter(r => name(r.player).toLowerCase().includes(query.toLowerCase())).slice().sort((a,b) => {
    const cmp = sort === "player" ? name(a.player).localeCompare(name(b.player)) : (parseFloat(a[sort]) || 0) - (parseFloat(b[sort]) || 0);
    return desc ? -cmp : cmp;
  });
  return <main className={s.page}>
    <TeamHeader />
    <section className={s.hero}>
      <div><span>All-time club records</span><h1>Club stats</h1><p>Every season. Every team. One club legacy.</p></div>
      <img src="/images/ecc-logo.png" alt="" />
    </section>
    <div className={s.content}>
      <div className={s.formatBar}><strong>Career totals · All ECC teams</strong><div><span>Format:</span>{(["odi","t20"] as const).map(f => <button key={f} aria-pressed={format===f} onClick={()=>setFormat(f)}>{f.toUpperCase()}</button>)}</div></div>
      <section className={s.leaders} aria-label="Career leaders">
        {([["runs","Most career runs","Runs"],["wickets","Most career wickets","Wickets"],["catches","Most career catches","Catches"]] as const).map(([key,title,unit],i)=>{
          const leader = rows.reduce<Row|undefined>((best,r)=>!best || Number(r[key])>Number(best[key]) ? r : best,undefined);
          return <article key={key} className={s.card} data-category={key}>
            <div className={s.photo}><Image src={`/images/stats/ecc-${["batting","bowling","catching"][i]}.jpg`} alt={`ECC ${["batting","bowling","catching"][i]} action — category photo, not a record-holder portrait`} fill sizes="(max-width: 800px) 90vw, 30vw" /></div>
            <div className={s.cardText}><h2>{title}</h2><strong>{leader ? Number(leader[key]).toLocaleString("en-GB") : "—"}</strong><span>{unit}</span><p>{leader ? name(leader.player) : "No records"}</p></div>
          </article>;
        })}
      </section>
      <p className={s.coverage}>Available records: 2026 · Career totals will grow as earlier and future seasons are added. Photos show ECC match action, not necessarily the named record holders.</p>
      <div className={s.toolbar}><div role="group" aria-label="Statistic type">{(Object.keys(columns) as (keyof typeof columns)[]).map(t=><button key={t} aria-pressed={tab===t} onClick={()=>{setTab(t);setSort(t==="batting"?"runs":t==="bowling"?"wickets":"catches");setDesc(true);}}>{t}</button>)}</div><label><span aria-hidden="true">⌕</span><input aria-label="Search player" placeholder="Search player…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
      <div className={s.tableWrap}><table><thead><tr><th>#</th>{columns[tab].map(([key,label])=><th key={key} aria-sort={sort===key ? desc?"descending":"ascending":"none"} className={sort===key?s.sorted:""}><button onClick={()=>{setSort(key);setDesc(sort===key?!desc:key!=="player");}}>{label}{sort===key && <span> {desc?"▾":"▴"}</span>}</button></th>)}</tr></thead>
        <tbody>{visible.map((r,i)=><tr key={r.player}><td>{i+1}</td>{columns[tab].map(([key])=><td key={key} className={sort===key?s.sorted:""}>{key==="player"?name(r.player):r[key]}</td>)}</tr>)}{!visible.length && <tr><td colSpan={columns[tab].length+1}>No players found.</td></tr>}</tbody></table></div>
      <footer>Career totals across recorded seasons · ODI and T20 tracked separately · {visible.length} players</footer>
    </div>
  </main>;
}
