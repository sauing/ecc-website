import data from "./verified-har.json";

import { ecc3OdiPlayers } from "../teams/ecc3-odi";
import { ecc4OdiPlayers } from "../teams/ecc4-odi";
import { ecc3Ecc4Raw } from "./ecc3-ecc4-raw";

import CareerStats from "./career-stats";

export type Source = Record<string, string | null> & { player: string };
type Row = Record<string, string> & { player: string };
const all = data as Record<"ecc1Odi" | "ecc2Odi" | "ecc1T20", Source[]>;
const num = (r: Source, key: string) => Number(r[key]) || 0;
const show = (value: number, digits = 0) => Number.isFinite(value) ? (digits ? value.toFixed(digits) : String(value)) : "—";
const overs = (balls: number) => balls ? `${Math.floor(balls / 6)}.${balls % 6}` : "0";
const normalize = (name: string) => name.toLocaleLowerCase("en").replace(/[^a-z0-9]/g, "");
const summaryPlayers = (raw: readonly (string | number)[]) => Array.from({ length: Math.floor(raw.length / 6) }, (_, i) => raw.slice(i * 6, i * 6 + 6)).map((p) => ({
  player: String(p[0]), NMA: String(p[1]), BAINN: String(p[1]), BAAGG: String(p[2]), BWWK: String(p[3]), FLCNWK: String(p[4]),
  BWBL: String((Math.floor(Number(p[5])) * 6) + Math.round((Number(p[5]) % 1) * 10)), BWRN: "0", BAHS: String(p[2]),
}));

function aggregate(sources: Source[][]): Row[] {
  const groups = new Map<string, Source[]>();
  for (const source of sources) for (const player of source) {
    const key = normalize(player.player);
    groups.set(key, [...(groups.get(key) ?? []), player]);
  }
  return [...groups.values()].map((records) => {
    const sum = (key: string) => records.reduce((total, record) => total + num(record, key), 0);
    const matches = sum("NMA"), innings = sum("BAINN"), notOut = sum("BANNO");
    const runs = sum("BAAGG"), wickets = sum("BWWK"), balls = sum("BWBL"), conceded = sum("BWRN");
    const faced = records.reduce((total, record) => {
      const rate = num(record, "BASTR");
      return total + (rate > 0 ? Math.round(num(record, "BAAGG") * 100 / rate) : 0);
    }, 0);
    const high = records.reduce((best, record) => num(record, "BAHS") > num(best, "BAHS") ? record : best, records[0]);
    const highScore = high.BAHS == null || high.BAHS === "" ? "—" : `${high.BAHS}${num(high, "BAHSNO") ? "*" : ""}`;
    const best = records.reduce((winner, record) => num(record, "BWBWK") > num(winner, "BWBWK") || (num(record, "BWBWK") === num(winner, "BWBWK") && num(record, "BWBRN") < num(winner, "BWBRN")) ? record : winner, records[0]);
    const bestBowling = num(best, "BWBL") ? `${num(best, "BWBWK")}/${num(best, "BWBRN")}` : "—";
    return {
      player: records[0].player, matches: show(matches), innings: show(innings), notOut: show(notOut),
      runs: show(runs), highScore, average: innings > notOut ? show(runs / (innings - notOut), 2) : "—",
      strikeRate: faced ? show(runs * 100 / faced, 2) : "—", minutes: show(sum("BAMIN")),
      hundreds: show(sum("BAN100")), fifties: show(sum("BAN50")), sixes: show(sum("BAN6")), fours: show(sum("BAN4")),
      overs: overs(balls), runsConceded: show(conceded), wickets: show(wickets), best: bestBowling,
      bowlingAverage: wickets ? show(conceded / wickets, 2) : "—",
      economy: balls ? show(conceded * 6 / balls, 2) : "—",
      bowlingStrikeRate: wickets ? show(balls / wickets, 2) : "—",
      maidens: show(sum("BWMD")), five: show(sum("BW5WI")),
      catches: show(sum("FLCNWK")), runOutsAssisted: show(sum("FLROA")),
      runOutsUnassisted: show(sum("FLROU")), wicketkeeperCatches: show(sum("FLCCWK")),
      stumpings: show(sum("FLST")),
    };
  }).sort((a, b) => Number(b.runs) - Number(a.runs));
}

const ecc3Odi = summaryPlayers(ecc3OdiPlayers) as Source[];
const ecc4Odi = summaryPlayers(ecc4OdiPlayers) as Source[];
const odiRows = aggregate([all.ecc1Odi, all.ecc2Odi, ecc3Ecc4Raw]);
const t20Rows = aggregate([all.ecc1T20]);
export default function ClubStatsPage() {
  return <CareerStats odi={odiRows} t20={t20Rows} />;
}
