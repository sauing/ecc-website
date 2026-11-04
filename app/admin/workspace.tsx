import type { AdminIdentity } from "../../lib/admin/auth";
import PinSettings from "./pin-settings";
import s from "./admin.module.css";

const modules = [
  { id: "members", label: "Members", description: "The club directory, with membership details and contact information." },
  { id: "registrations", label: "Registrations", description: "Review membership applications and record approval decisions." },
  { id: "programmes", label: "Membership programmes", description: "Manage membership choices, seasons and fees." },
  { id: "payments", label: "Payments", description: "Review payments and outstanding membership balances." },
  { id: "teams", label: "Teams & seasons", description: "Organise members into teams for each season." },
  { id: "notices", label: "Website notices", description: "Prepare announcements for the club website." },
  { id: "communications", label: "Communications", description: "Prepare and send messages to club members." },
  { id: "reports", label: "Reports & exports", description: "Download club administration records." },
  { id: "access", label: "Access management", description: "Invite administrators and moderators and manage their permissions." },
  { id: "activity", label: "Activity log", description: "Review changes made through the administration portal." },
];

export default function AdminWorkspace({ identity, section, pinConfigured }: { identity: AdminIdentity; section?: string; pinConfigured: boolean }) {
  const allowedModules = identity.role === "admin" ? modules : modules.filter(module => ["notices", "communications"].includes(module.id));
  const navigation = [{ id: "overview", label: "Dashboard" }, ...allowedModules, { id: "settings", label: "Account & security" }];
  const selected = navigation.find(item => item.id === section) ?? navigation[0];
  const module = allowedModules.find(item => item.id === selected.id);
  const roleLabel = identity.role === "admin" ? "Administrator" : "Moderator";
  const href = (id: string) => id === "overview" ? "/admin" : `/admin?section=${id}`;
  const nav = <nav className={s.portalNav} aria-label="Admin sections">{navigation.map((item, index) => <a key={item.id} href={href(item.id)} aria-current={selected.id === item.id ? "page" : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.label}</a>)}</nav>;

  return <div className={s.shell}>
    <aside className={s.sidebar}>
      <a className={s.brand} href="/admin"><img src="/images/ecc-logo.png" alt="ECC crest"/><span>Eindhoven<br/>Cricket Club<small>Administration portal</small></span></a>
      <div className={s.desktopNav}>{nav}</div>
      <details className={s.mobileNav}><summary>Administration menu <span aria-hidden="true">＋</span></summary>{nav}</details>
      <div className={s.sidebarFoot}><span className={s.role}>{roleLabel}</span><span>{identity.email}</span><a href="/">View club website ↗</a><form action="/auth/logout" method="post"><button>Sign out</button></form></div>
    </aside>
    <div className={s.workspace}>
      <header className={s.topbar}><span>ECC administration <span aria-hidden="true">/</span> {selected.label}</span><span className={s.connection}>Signed in · {roleLabel}</span></header>
      <main className={s.main}>
        <div className={s.pageHeading}><div><span className={s.kicker}>Your club, organised</span><h1>{selected.id === "overview" ? "Club dashboard" : selected.label}</h1><p>{selected.id === "overview" ? "Welcome to your club’s administration portal." : selected.id === "settings" ? "Your account and the ways you sign in." : module?.description}</p></div>{selected.id === "overview" && <a className={s.primary} href={href("settings")}>Account & security →</a>}</div>

        {selected.id === "overview" && <>
          <div className={s.portalStatusGrid}>
            <section className={s.metric}><span>Your access</span><strong>{roleLabel}</strong><small>Verified club access</small></section>
            <section className={s.metric}><span>Account status</span><strong>Active</strong><small>Email and password sign-in</small></section>
            <section className={s.metric}><span>ECC PIN quick login</span><strong>{pinConfigured ? "Optional" : "Setup pending"}</strong><small>{pinConfigured ? "Manage your PIN in Account & security" : "Password login is available"}</small></section>
          </div>
          <div className={s.overviewGrid}>
            <section className={s.panel}><div className={s.sectionHead}><h2>Your workspace</h2><span className={s.badge} data-tone="green">Signed in</span></div><p>Use the navigation to find the club’s administration tools. Account access is connected; the remaining tools will be added one workflow at a time.</p><div className={s.portalTasks}>
              <a href={href("settings")}><span><strong>Account & security</strong><small>Check your access and manage optional quick login.</small></span><span aria-hidden="true">→</span></a>
              {identity.role === "admin" && <a href={href("members")}><span><strong>Member administration</strong><small>The next area to connect.</small></span><span className={s.badge}>Not connected</span></a>}
              <a href="/" target="_blank" rel="noreferrer"><span><strong>Club website</strong><small>Open the public website in another tab.</small></span><span aria-hidden="true">↗</span></a>
            </div></section>
            <section className={`${s.panel} ${s.clubPanel}`}><span className={s.kicker}>Eindhoven Cricket Club · Since 1915</span><h2>More cricket.<br/>Less paperwork.</h2><p>A home for the people who keep the club moving.</p><a href="/" target="_blank" rel="noreferrer">Visit the club website ↗</a></section>
          </div>
          <section className={s.panel}><div className={s.sectionHead}><h2>Club administration</h2><span className={s.badge}>Next workflows</span></div><div className={s.portalModuleGrid}>{allowedModules.map(item => <a key={item.id} href={href(item.id)}><strong>{item.label}<span aria-hidden="true">→</span></strong><span>{item.description}</span><small>Not connected yet</small></a>)}</div></section>
        </>}

        {selected.id === "settings" && <>
          <section className={s.panel}><div className={s.sectionHead}><h2>Your account</h2><span className={s.badge} data-tone="green">Active</span></div><dl className={s.portalAccount}><div><dt>Email</dt><dd>{identity.email}</dd></div><div><dt>Role</dt><dd>{roleLabel}</dd></div><div><dt>Sign-in method</dt><dd>Email and password</dd></div></dl><p className={s.hint}>For a password reset, contact the website maintainer.</p></section>
          {identity.role === "admin" && <section className={s.panel}><PinSettings configured={pinConfigured}/></section>}
        </>}

        {module && <section className={`${s.panel} ${s.portalPending}`}><span className={s.kicker}>Next workflow</span><h2>{module.label} is not connected yet</h2><p>This area is ready for the next stage of development. Real records and editing tools will appear here once this workflow is connected.</p><div className={s.rowActions}><a className={s.primary} href="/admin">Back to dashboard</a></div></section>}
      </main>
      <footer className={s.footer}><span>Eindhoven Cricket Club · Administration</span><span>Signed in as {identity.email}</span></footer>
    </div>
  </div>;
}
