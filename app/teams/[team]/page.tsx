import TeamPageFrame from "../team-page-frame";
import SeasonOverview from "../season-overview";
import { ecc1OdiFielding, ecc1OdiMatches as ecc1OdiMatchesSource } from "../ecc1-odi";
import { ecc1T20Ladder, ecc1T20Players } from "../ecc1-t20";
import { ecc2OdiLadder, ecc2OdiMatches } from "../ecc2-odi";

type TeamKey = "ecc1" | "ecc2" | "ecc3" | "ecc4" | "youth-1" | "youth-2";
const teams: Record<TeamKey, { name: string; label: string; description: string; division: string }> = {
  ecc1: { name: "ECC1", label: "Men's First XI", description: "ECC's senior first team competing in the Hoofdklasse, one of the Netherlands' leading cricket competitions.", division: "Hoofdklasse" },
  ecc2: { name: "ECC2", label: "Men's Second XI", description: "A competitive senior side building the next generation of ECC players.", division: "Senior cricket" },
  ecc3: { name: "ECC3", label: "Men's Third XI", description: "Club cricket, development and match-day competition in one team.", division: "Senior cricket" },
  ecc4: { name: "ECC4", label: "Men's Fourth XI", description: "A welcoming senior team for players who love the game and the club.", division: "Senior cricket" },
  "youth-1": { name: "Youth 1", label: "Youth cricket", description: "Youth team page coming soon.", division: "Youth" },
  "youth-2": { name: "Youth 2", label: "Youth cricket", description: "Youth team page coming soon.", division: "Youth" },
};
const statsGrade: Record<string, string> = { ecc1: "HK", ecc2: "73940", ecc3: "FOUR_E", ecc4: "FOUR_E" };
async function getJson(path: string) { try { const r = await fetch(`https://ecc-season-app.vercel.app${path}`, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(12000) }); return r.ok ? r.json() : null; } catch { return null; } }
export function generateStaticParams() { return Object.keys(teams).map((team) => ({ team })); }

function MatchRow({ match, compact = false }: { match: readonly string[]; compact?: boolean }) {
  const [date, home, homeScore, away, awayScore, result] = match;
  const normalizedResult = result.toLowerCase();
  const isGenericWin = normalizedResult === "won";
  const isGenericLoss = normalizedResult === "lost";
  const isEccWin = normalizedResult.includes("eindhoven") && normalizedResult.includes("won");
  const isEccLoss = normalizedResult.includes("won") && !isEccWin;
  const tone = isGenericWin || isEccWin ? "match-win" : isGenericLoss || isEccLoss ? "match-loss" : "match-scheduled";
  return <article className={`scorecard-row ${tone}`}><strong>{home} <b>vs</b> {away}</strong><span>{date} · {result}</span><small>{home}: {homeScore} · {away}: {awayScore}</small></article>;
}

export default async function TeamPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params; const team = teams[slug as TeamKey] ?? teams.ecc1; const isYouth = slug.startsWith("youth"); const isEcc2 = slug === "ecc2"; const ecc1OdiMatches = isEcc2 ? ecc2OdiMatches : ecc1OdiMatchesSource; const odiLadder = isEcc2 ? ecc2OdiLadder : { position: 7, wins: 4, losses: 10, played: 14, points: 8, nrr: "-0.72" };
  const fixturePayload = !isYouth ? await getJson(`/api/kncb-matches?team=${slug.toUpperCase()}&season=2026`) : null;
  const grade = statsGrade[slug];
  const [battingPayload, bowlingPayload, fieldingPayload] = !isYouth ? await Promise.all([getJson(`/api/kncb-stats?grade=${grade}&type=batting`), getJson(`/api/kncb-stats?grade=${grade}&type=bowling`), getJson(`/api/kncb-stats?grade=${grade}&type=fielding`)]) : [null, null, null];
  const t20 = fixturePayload?.fixtures ?? []; const batting = (battingPayload?.rows ?? []).filter((r: { club?: string }) => r.club?.toLowerCase().includes("eindhoven")); const bowling = (bowlingPayload?.rows ?? []).filter((r: { club?: string }) => r.club?.toLowerCase().includes("eindhoven")); const fielding = (fieldingPayload?.rows ?? []).filter((r: { club?: string }) => r.club?.toLowerCase().includes("eindhoven"));
  const players = [...[...batting.map((p: Record<string, string>) => ({ ...p, statType: "batting" })), ...bowling.map((p: Record<string, string>) => ({ ...p, statType: "bowling" })), ...fielding.map((p: Record<string, string>) => ({ ...p, statType: "fielding" }))].reduce((map, p: { player: string; statType: string; matches?: string; runs?: string; wickets?: string; catches?: string }) => {
    const current = map.get(p.player) ?? { player: p.player };
    if (p.statType === "batting") { current.matches = p.matches; current.runs = p.runs; }
    if (p.statType === "bowling") current.wickets = p.wickets;
    if (p.statType === "fielding") current.catches = p.catches;
    map.set(p.player, current);
    return map;
  }, new Map<string, { player: string; matches?: string; runs?: string; wickets?: string; catches?: string }>()).values()];
  const playersWithOdiFielding = players.map((p) => ({ ...p, catches: ecc1OdiFielding[p.player] ?? p.catches }));
  const topBatter = batting[0];
  const topBowler = bowling[0];
  const t20Wins = t20.filter((f: { result?: string }) => f.result?.toLowerCase().includes("won")).length;
  if (!isYouth && !isEcc2) {
    const overviewPlayers = playersWithOdiFielding.map((p) => [p.player, Number(p.matches ?? 0), Number(p.runs ?? 0), Number(p.wickets ?? 0), Number(p.catches ?? 0), 0] as const);
    const t20Players = ecc1T20Players.map(([player, runs, wickets, catches, matches]) => [player, Number(matches), Number(runs), Number(wickets), Number(catches), 0] as const);
    const t20Matches = t20.map((f: { matchDate: string; homeTeam: string; homeScore?: string; awayTeam: string; awayScore?: string; result?: string }) => [f.matchDate, f.homeTeam, f.homeScore ?? "—", f.awayTeam, f.awayScore ?? "—", f.result ?? "Scheduled"]);
    return <TeamPageFrame label={team.label + " · " + team.division} name={team.name} description={team.description}><SeasonOverview team={team.name} division={team.division} ladder={odiLadder} matches={ecc1OdiMatches} players={overviewPlayers} showT20={slug === "ecc1"} t20={slug === "ecc1" ? { ladder: ecc1T20Ladder, matches: t20Matches, players: t20Players } : undefined} /></TeamPageFrame>;
  }

  return <TeamPageFrame label={team.label + " · " + team.division} name={team.name} description={team.description}>
    {isYouth ? <section className="team-placeholder"><span className="section-kicker">Youth cricket</span><h2>Coming soon.</h2><p>This team page is reserved for ECC youth cricket. Fixtures, players and stats will be added when youth data is ready.</p></section> : <div className="competition-tabs">
      <input id="odi-tab" type="radio" name="competition" defaultChecked />
      <input id="t20-tab" type="radio" name="competition" />
      <div className="competition-tabbar"><label htmlFor="odi-tab">ODI</label><label htmlFor="t20-tab">T20</label></div>
      <section className="competition-block odi-block"><div className="competition-heading"><span className="section-kicker">ODI · Hoofdklasse A Men</span><h2>ODI season</h2><p>14 matches · 4 wins · 10 losses · 8 points · 7th place</p></div><div className="team-stats"><div><strong>7th</strong><span>League position</span></div><div><strong>4–10</strong><span>Win / loss</span></div><div><strong>{topBatter?.runs ?? "—"}</strong><small>{topBatter?.player ?? "No batter"}</small><span>Top ODI batter</span></div><div><strong>{topBowler?.wickets ?? "—"}</strong><small>{topBowler?.player ?? "No bowler"}</small><span>Top ODI bowler</span></div></div><div className="competition-grid"><div><span className="section-kicker">ODI match centre</span><h3>Results &amp; scorecards</h3><div className="scorecard-list">{ecc1OdiMatches.map((m) => <MatchRow key={`${m[0]}-${m[1]}`} match={m} />)}</div></div><div><span className="section-kicker">ODI squad stats</span><h3>Players · {players.length}</h3><div className="player-list">{playersWithOdiFielding.map((p: { player: string; matches?: string; runs?: string; wickets?: string; catches?: string }) => <article key={p.player}><strong>{p.player}</strong><span>{p.matches ? `${p.matches} matches · ` : ""}{p.runs ? `${p.runs} runs` : ""}{p.wickets ? ` · ${p.wickets} wickets` : ""}{p.catches ? ` · ${p.catches} catches` : ""}</span></article>)}</div></div></div></section>
      <section className="competition-block t20-block"><div className="competition-heading"><span className="section-kicker">T20 · Season 2026</span><h2>T20 season</h2><p>{ecc1T20Ladder.played} matches · {ecc1T20Ladder.wins} wins · {ecc1T20Ladder.losses} losses · {ecc1T20Ladder.points} points · {ecc1T20Ladder.position}th place</p></div><div className="team-stats"><div><strong>{ecc1T20Ladder.position}th</strong><span>League position</span></div><div><strong>{ecc1T20Ladder.wins}–{ecc1T20Ladder.losses}</strong><span>Win / loss</span></div><div><strong>{ecc1T20Players[0][1]}</strong><small>{ecc1T20Players[0][0]}</small><span>Top T20 batter</span></div><div><strong>{ecc1T20Players.reduce((best, p) => p[2] > best[2] ? p : best)[2]}</strong><small>{ecc1T20Players.reduce((best, p) => p[2] > best[2] ? p : best)[0]}</small><span>Top T20 bowler</span></div></div><div className="competition-grid"><div><span className="section-kicker">T20 match centre</span><h3>Results &amp; scorecards</h3><div className="scorecard-list">{t20.map((f: { sourceKey: string; matchDate: string; homeTeam: string; awayTeam: string; homeScore?: string; awayScore?: string; result?: string }) => <MatchRow key={f.sourceKey} match={[f.matchDate, f.homeTeam, f.homeScore ?? "—", f.awayTeam, f.awayScore ?? "—", f.result ?? "Scheduled"]} />)}</div></div><div><span className="section-kicker">T20 squad stats</span><h3>Players</h3><div className="player-list">{ecc1T20Players.map(([player, runs, wickets, catches, matches]) => <article key={`t20-${player}`}><strong>{player}</strong><span>{matches} matches · {runs} runs · {wickets} wickets · {catches} catches</span></article>)}</div></div></div></section>
    </div>}
  </TeamPageFrame>;
}
