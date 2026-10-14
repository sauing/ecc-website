"use client";
import { useState } from "react";
import s from "./season.module.css";
type Match = readonly (string | null)[];
type Player = readonly [string, number, number, number, number, number];
const displayName = (v:string) => v.includes(",") ? v.split(",").reverse().map(x=>x.trim()).join(" ") : v;
const ordinal = (n:number) => `${n}${n%100>=11&&n%100<=13?"th":({1:"st",2:"nd",3:"rd"} as Record<number,string>)[n%10]??"th"}`;
export default function SeasonOverview({ team, division, ladder, matches, players, t20, showT20 = false }: { team: string; division: string; ladder: { position: number; played: number; wins: number; losses: number; points: number; nrr?: string }; matches: readonly Match[]; players: readonly Player[]; t20?: { ladder: { position: number; played: number; wins: number; losses: number; points: number; nrr?: string }; matches: readonly Match[]; players: readonly Player[] }; showT20?: boolean }) {

  const [rankingTab,setRankingTab] = useState<"batting"|"bowling"|"fielding">("batting");
  const [competition,setCompetition] = useState<"odi"|"t20">("odi");
  const [query,setQuery] = useState("");
  const active = competition==="t20" && t20 ? t20 : {ladder,matches,players};
  const metric = rankingTab==="batting"?2:rankingTab==="bowling"?3:4;
  const unit = rankingTab==="batting"?"runs":rankingTab==="bowling"?"wickets":"catches";
  const rankings = [...active.players].sort((a,b)=>b[metric]-a[metric]).slice(0,5);
  const officialTeam = team==="ECC1"?"Eindhoven":/^ECC\d+$/.test(team)?team.replace("ECC","Eindhoven "):team;
  const same = (a:string|null|undefined,b:string) => a?.trim().toLowerCase()===b.toLowerCase();
  const result = (m:Match) => {
    const text=(m[m.length-1]??"").trim().toLowerCase();
    if(text==="won") return "W";
    if(text==="lost") return "L";
    const winner=text.match(/^(.*?) won(?:\s|$)/);
    if(winner) return same(winner[1],officialTeam)?"W":"L";
    return "—";
  };
  const opponent = (m:Match) => {
    const away=m.length>=6?m[3]:m[2];
    return same(m[1],officialTeam)?away:m[1];
  };
  const shortDate = (raw:string|null) => {
    if(!raw) return "—";
    const date = new Date(/^\d{4}-/.test(raw)?raw+"T12:00:00":raw);
    return Number.isNaN(date.getTime())?raw:new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"short"}).format(date);
  };
  const matchesToShow=active.matches.filter(m=>!m.some(v=>v?.toLowerCase()==="bye"));
  const tone=(m:Match)=>result(m)==="W"?s.win:result(m)==="L"?s.loss:s.neutral;
  const nrr=active.ladder.nrr;
  const stats=[["League position",ordinal(active.ladder.position),""],["Points",active.ladder.points,""],["Played",active.ladder.played,""],["Wins",active.ladder.wins,s.win],["Losses",active.ladder.losses,s.loss],["Net run rate",nrr===undefined?"—":Number(nrr)>0?`+${Number(nrr).toFixed(2)}`:Number(nrr).toFixed(2),""]];
  return <section className={s.content} aria-label={`${team} · ${division} season records`}>
    <div className={s.controls}>
      <div><label htmlFor="team-season">Season</label><select id="team-season" defaultValue="2026"><option value="2026">2026</option><option disabled value="2027">2027 · Coming soon</option></select></div>
      <div><span>Format</span><button aria-pressed={competition==="odi"} onClick={()=>setCompetition("odi")}>ODI</button>{showT20&&t20&&<button aria-pressed={competition==="t20"} onClick={()=>setCompetition("t20")}>T20</button>}</div>
    </div>
    <div className={s.summary}>{stats.map(([label,value,color])=><div key={label}><span>{label}</span><strong className={String(color)}>{value}</strong></div>)}</div>
    <div className={s.form}><span>Recent form</span>{matchesToShow.filter(m=>result(m)!=="—").slice(-5).map((m,i)=><b key={i} className={tone(m)} title={`${m[0]}: ${m[m.length-1]}`}>{result(m)}</b>)}</div>
    <div className={s.panels}>
      <section className={s.panel}><div className={s.panelHead}><h2>Match results</h2><span className={s.note}>{matchesToShow.length} fixtures</span></div>
        <div className={s.scroll} tabIndex={0} aria-label="All season match results"><table className={s.table}><thead><tr><th>Date</th><th>Opponent</th><th>Result</th><th>Score / result detail</th></tr></thead><tbody>{matchesToShow.map((m,i)=><tr key={i}><td>{shortDate(m[0])}</td><td>{opponent(m)}</td><td><strong className={tone(m)}>{result(m)}</strong></td><td>{m.length>=6?<><span>{same(m[1],officialTeam)?m[2]:m[4]} – {same(m[1],officialTeam)?m[4]:m[2]}</span><small style={{display:"block",color:"#647080",marginTop:4}}>{m[5]}</small></>:m[m.length-1]??"Scheduled"}</td></tr>)}</tbody></table></div>
      </section>
      <section className={s.panel}><div className={s.panelHead}><h2>Player rankings</h2><div className={s.tabs} role="group" aria-label="Ranking category">{(["batting","bowling","fielding"] as const).map(t=><button key={t} aria-pressed={rankingTab===t} onClick={()=>setRankingTab(t)}>{t}</button>)}</div></div>
        <table className={`${s.table} ${s.rank}`}><tbody>{rankings.map((p,i)=><tr key={p[0]}><td>{i+1}</td><td>{displayName(p[0])}</td><td><strong>{p[metric]}</strong> <small>{unit}</small></td></tr>)}</tbody></table>
      </section>
    </div>
    <section className={`${s.panel} ${s.squad}`}><div className={s.panelHead}><h2>Squad stats</h2><input className={s.search} aria-label="Search squad players" placeholder="Search players…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <div className={s.wide}><table className={s.table}><thead><tr>{["#","Player","Matches","Runs","Wickets","Catches"].map(t=><th key={t}>{t}</th>)}</tr></thead><tbody>{active.players.filter(p=>displayName(p[0]).toLowerCase().includes(query.toLowerCase())).map((p,i)=><tr key={p[0]}><td>{i+1}</td><td>{displayName(p[0])}</td>{p.slice(1,5).map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>
      <p className={s.note}>Team records for the selected season · Career totals available in <a href="/stats">Club Stats</a></p>
    </section>
  </section>;
}

