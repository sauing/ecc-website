import { clubNotice, type ClubNotice } from "./club-notice";
import s from "./notice-bar.module.css";

export default function NoticeBar({ notice = clubNotice }: { notice?: ClubNotice | null }) {
  const action = notice?.action;
  // Accept site-relative paths or HTTPS destinations, never executable schemes.
  const safeLink = action && (/^\/(?!\/)/.test(action.href) || /^https:\/\//i.test(action.href));
  return <aside className={s.bar} aria-label={notice ? "Club announcement" : "Club motto"}>
    <span className={notice ? s.badge : s.established}>{notice ? "Club update" : "Est. 1915"}</span>
    <span className={s.message}>{notice ? notice.message : "Cricket · People · Community · Eindhoven"}</span>
    {safeLink && <a className={s.action} href={action.href}>{action.label} <span aria-hidden="true">→</span></a>}
    <a className={s.login} href="/login"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/></svg>My ECC / Login</a>
  </aside>;
}
