import {redirect} from "next/navigation";
import {accountAuth,profiles} from "../../../lib/account/service";
import AccountShell from "../account-shell";
import ProfileForm from "../profile-form";
import s from "../account.module.css";
export const metadata={title:"Complete your ECC account",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function CompleteProfilePage() {
  const session=await accountAuth.currentAccount();
  if(session.state==="signed-out"||session.state==="setup") redirect("/login");
  if(session.state!=="ready") return <AccountShell><main className={s.main}><h1>Account unavailable</h1><p>Please try again shortly.</p></main></AccountShell>;
  if(!session.account.verified) redirect("/login?auth=failed");
  let profile;
  try{profile=await profiles.readOwn(session.account.id);}catch{return <AccountShell><main className={s.main}><h1>Your details could not be loaded</h1><p>Please try again shortly.</p></main></AccountShell>;}
  return <AccountShell><main className={s.onboarding}><section className={s.intro}><span className={s.kicker}>Your place at ECC</span><h1>{profile?"Keep your details up to date.":"A couple of details, then you’re in."}</h1><p>We need your address and phone number to complete your account. No membership choice or payment is required today.</p><dl className={s.identity}><dt>Name</dt><dd>{session.account.name}</dd><dt>Email</dt><dd>{session.account.email}</dd></dl></section><section className={s.card} aria-label="Contact details"><span className={s.kicker}>Your contact details</span><h2>{profile?"Update your profile":"Complete your account"}</h2><ProfileForm initial={profile}/></section></main></AccountShell>;
}
