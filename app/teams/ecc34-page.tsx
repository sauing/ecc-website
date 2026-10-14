import TeamPageFrame from "./team-page-frame";
import SeasonOverview from "./season-overview";
import { ecc3OdiMatches, ecc3OdiPlayers } from "./ecc3-odi";
import { ecc4OdiMatches, ecc4OdiPlayers } from "./ecc4-odi";
type Player = readonly [string, number, number, number, number, number];
const chunk=(raw: readonly (string|number)[])=>Array.from({length:Math.floor(raw.length/6)},(_,i)=>raw.slice(i*6,i*6+6) as unknown as Player);
const data={ecc3:{name:"ECC3",team:"Eindhoven 3",position:6,played:16,wins:7,losses:8,points:15,nrr:"0.39",players:chunk(ecc3OdiPlayers),matches:ecc3OdiMatches},ecc4:{name:"ECC4",team:"Eindhoven 4",position:2,played:16,wins:10,losses:4,points:22,nrr:"0.95",players:chunk(ecc4OdiPlayers),matches:ecc4OdiMatches}} as const;
export default function Ecc34Page({team}:{team:"ecc3"|"ecc4"}){const d=data[team];return <TeamPageFrame label={`Men's ${team==="ecc3"?"Third":"Fourth"} XI · Vierde Klasse`} name={d.name} description={`${d.team} competing in the Vierde Klasse.`}><SeasonOverview team={d.team} division="Vierde Klasse" ladder={d} matches={d.matches.map(m=>[m[0],m[1],m[2],m[3]])} players={d.players}/></TeamPageFrame>}

