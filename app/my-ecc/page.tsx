import {redirect} from "next/navigation";
import Link from "next/link";
import {accountAuth,profiles} from "../../lib/account/service";
import {adminAuth} from "../../lib/admin/service";
import AccountShell from "./account-shell";
import s from "./account.module.css";
export const metadata={title:"My ECC | Eindhoven Cricket Club",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function MemberPage({searchParams}:{searchParams:Promise<{view?:string}>}) {
  const session=await accountAuth.currentAccount();
  if(session.state==="signed-out"||session.state==="setup") redirect("/login");
  if(session.state!=="ready") return <AccountShell><main className={s.main}><h1>Account unavailable</h1><p>Please try again shortly.</p></main></AccountShell>;
  if(!session.account.verified) redirect("/login?auth=failed");
  let profile;
  try{profile=await profiles.readOwn(session.account.id);}catch{return <AccountShell><main className={s.main}><h1>Your details could not be loaded</h1><p>Please try again shortly.</p></main></AccountShell>;}
  if(!profile) redirect("/my-ecc/complete-profile");
  const access=await adminAuth.currentAccess();
  const requested=(await searchParams).view;
  const view=requested==="profile"||requested==="membership"?requested:"overview";
  const name=profile.fullName;
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("").toUpperCase();
  return <AccountShell><div className={s.portal}>
    <aside className={s.sidebar}>
      <div className={s.portalBrand}><span className={s.kicker}>Your club, connected</span><strong>My ECC</strong><p>Member portal</p></div>
      <nav aria-label="Member portal" className={s.portalNav}>
        {[{id:"overview",label:"Overview",number:"01"},{id:"profile",label:"My profile",number:"02"},{id:"membership",label:"Membership",number:"03"}].map(item=><Link key={item.id} href={item.id==="overview"?"/my-ecc":`/my-ecc?view=${item.id}`} aria-current={view===item.id?"page":undefined}><span aria-hidden="true">{item.number}</span>{item.label}<span aria-hidden="true">→</span></Link>)}
        {access.state==="ready"&&<Link href="/admin"><span aria-hidden="true">↗</span>Administration</Link>}
      </nav>
      <div className={s.sidebarFoot}><span className={s.avatar} aria-hidden="true">{initials||"ECC"}</span><div><strong>{name}</strong><span>ECC account</span></div></div>
    </aside>
    <main className={s.workspace} id="member-content">
      <div className={s.breadcrumb}>My ECC <span aria-hidden="true">/</span> {view==="profile"?"My profile":view==="membership"?"Membership":"Overview"}</div>
      <div className={s.heading}><div><span className={s.kicker}>Eindhoven Cricket Club · Since 1915</span><h1>{view==="profile"?"Your profile.":view==="membership"?"Your next innings.":`Welcome back, ${name.split(/\s+/)[0]}.`}</h1><p>{view==="profile"?"Your contact details, kept in one place.":view==="membership"?"Find your place on the pitch, at your own pace.":"Your club. Your details. Your next step."}</p></div><span className={s.badge}>Account ready</span></div>
      {view==="overview"&&<>
        <section className={s.welcome}><div><span className={s.kicker}>You belong here</span><h2>More than a game.<br/>A club to call home.</h2><p>You’re part of the ECC community. Explore the club and choose a cricket membership whenever you’re ready.</p><Link className={s.primary} href="/my-ecc?view=membership">Explore membership <span aria-hidden="true">→</span></Link></div><img src="/images/gallery/club-moments/dsc_0095.webp" alt="ECC teammates together on the cricket ground with their shield"/></section>
        <div className={s.portalGrid}>
          <section className={s.portalCard}><div className={s.cardTop}><span className={s.kicker}>Your account</span><span className={s.status}>Profile complete</span></div><h2>{name}</h2><p className={s.email}>{session.account.email}</p><p>Your address and phone number are saved. You can update them at any time.</p><Link className={s.link} href="/my-ecc?view=profile">View my profile →</Link></section>
          <section className={s.portalCard}><div className={s.cardTop}><span className={s.kicker}>Your cricket</span><span className={s.neutralStatus}>Not selected</span></div><h2>Membership can wait.</h2><p>No cricket membership has been activated through this portal. Browse the options or ask the club for help choosing.</p><Link className={s.link} href="/my-ecc?view=membership">View membership options →</Link></section>
        </div>
        <section className={s.clubLinks} aria-labelledby="club-links"><div><span className={s.kicker}>Stay close to the club</span><h2 id="club-links">Around ECC</h2></div><div><Link href="/teams/ecc1">Teams & cricket <span aria-hidden="true">↗</span></Link><Link href="/youth">Youth cricket <span aria-hidden="true">↗</span></Link><Link href="/contact">Talk to the club <span aria-hidden="true">↗</span></Link></div></section>
      </>}
      {view==="profile"&&<section className={s.portalCard}><div className={s.cardTop}><h2>Personal & contact details</h2><span className={s.status}>Saved to your account</span></div><dl className={s.identity}><dt>Name</dt><dd>{name}</dd><dt>Email</dt><dd>{session.account.email}</dd><dt>Address</dt><dd className={s.address}>{profile.address}</dd><dt>Phone</dt><dd>{profile.phone}</dd></dl><Link className={s.primary} href="/my-ecc/complete-profile">Edit contact details →</Link><p className={s.hint}>Your name and email come from your Google sign-in. Your address and phone are private contact details.</p></section>}
      {view==="membership"&&<><section className={s.next}><span className={s.kicker}>At your own pace</span><h2>Your account is ready.<br/>Choose your cricket next.</h2><p>Creating an ECC account does not automatically activate a cricket membership. You can browse programmes now and come back when you’re ready.</p><Link className={s.primary} href="/membership">Browse membership programmes →</Link></section><section className={s.portalCard}><span className={s.neutralStatus}>Online enrolment coming later</span><h2>Let’s find the right fit.</h2><p>Online membership selection and payments are not available in the portal yet. Contact ECC for help joining a programme or linking an existing club membership.</p><Link className={s.link} href="/contact">Ask the club about membership →</Link></section></>}
      <footer className={s.portalFooter}><span>Eindhoven Cricket Club · One club. Your place.</span><Link href="/contact">Need a hand? Contact ECC →</Link></footer>
    </main>
  </div></AccountShell>;
}
