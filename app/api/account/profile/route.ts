import { accountAuth, profiles } from "../../../../lib/account/service";
import { parseProfile } from "../../../../lib/account/profile";
const reply = (body: unknown, status = 200) => Response.json(body,{status,headers:{"Cache-Control":"private, no-store"}});
export async function POST(request: Request) {
  if (!process.env.APP_URL || request.headers.get("origin") !== new URL(process.env.APP_URL).origin) return reply({error:"Request origin not allowed."},403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return reply({error:"Use JSON."},415);
  const session = await accountAuth.currentAccount();
  if (session.state !== "ready" || !session.account.verified) return reply({error:"Sign in before saving your profile."},session.state==="unavailable"||session.state==="setup"?503:401);
  const raw=await request.text();
  if(raw.length>4096) return reply({error:"Request too large."},413);
  let profile;
  try { profile=parseProfile(JSON.parse(raw)); } catch(error) { return reply({error:error instanceof SyntaxError?"Invalid request.":error instanceof Error?error.message:"Invalid profile details."},400); }
  try { await profiles.saveOwn(session.account.id,{...profile,fullName:session.account.name,email:session.account.email.toLowerCase()}); return reply({saved:true,redirectTo:"/my-ecc"}); }
  catch { return reply({error:"Your details could not be saved. Please try again."},503); }
}
