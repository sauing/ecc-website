import TeamPageFrame from "../team-page-frame";
import SeasonOverview from "../season-overview";
import { ecc2OdiLadder, ecc2OdiMatches, ecc2OdiPlayers } from "../ecc2-odi";

export default function ECC2Page(){
  return <TeamPageFrame label="Men's Second XI · Tweede Klasse" name="ECC2" description="ECC's second XI competing in the Tweede Klasse.">
    <SeasonOverview team="Eindhoven 2" division="Tweede Klasse" ladder={ecc2OdiLadder} matches={ecc2OdiMatches.map(m=>[m[0],m[1],m[2],m[3],m[4],m[5]])} players={ecc2OdiPlayers}/>
  </TeamPageFrame>;
}
