import { clubNotice, type ClubNotice } from "./club-notice";
import s from "./notice-bar.module.css";

export default function NoticeBar({ notice = clubNotice }: { notice?: ClubNotice | null }) {
  const action = notice?.action;
  // Accept site-relative paths or HTTPS destinations, never executable schemes.
  const safeLink = action && (/^\/(?!\/)/.test(action.href) || /^https:\/\//i.test(action.href));
  return <aside className={s.bar} aria-label={notice ? "Club announcement" : "Club motto"}>
    <span className={notice ? s.badge : s.established}>{notice ? "Club update" : "A KNCB AFFILIATED CLUB"}</span>
    <div className={s.socialLinks} role="group" aria-label="Follow Eindhoven Cricket Club">
      <a className={s.socialLink} href="https://www.instagram.com/eindhovencc1915/" target="_blank" rel="noreferrer" aria-label="Instagram">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
      </a>
      <span className={s.socialLink} role="img" aria-label="X">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M18.901 1.153h3.68L14.54 10.036 24 22.847h-7.405l-5.8-7.584-6.636 7.584H.475l8.401-9.613L.48 1.153h7.593l5.243 6.932zM17.61 20.59h2.04L6.45 3.29H4.26z"/></svg>
      </span>
      <span className={s.socialLink} role="img" aria-label="TikTok">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.13 1.77 4.19 1.14 1.09 2.76 1.59 4.3 1.76v4.05c-1.44-.05-2.89-.35-4.18-.97-.56-.25-1.08-.57-1.6-.9-.01 2.81.01 5.62-.02 8.42-.08 1.36-.53 2.72-1.33 3.83-1.29 1.88-3.53 3.11-5.82 3.15-1.4.08-2.8-.3-3.99-1.04-1.98-1.21-3.36-3.43-3.57-5.75-.03-.51-.04-1.02-.01-1.53.18-1.91 1.12-3.75 2.58-5 1.66-1.45 3.98-2.14 6.16-1.73.02 1.49-.04 2.99-.04 4.48-1-.32-2.18-.23-3.05.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.81 3.02 3.48 2.87 1.11-.01 2.17-.66 2.75-1.59.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.04-12.08z"/></svg>
      </span>
      <a className={s.socialLink} href="https://www.facebook.com/Eindhoven-Cricket-Club-100388158821488" target="_blank" rel="noreferrer" aria-label="Facebook">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M13.4 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.2v3.2H10V21z"/></svg>
      </a>
      <span className={s.socialLink} role="img" aria-label="YouTube">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6z"/></svg>
      </span>
    </div>
    {safeLink && <a className={s.action} href={action.href}>{action.label} <span aria-hidden="true">→</span></a>}
    <a className={s.login} href="/login"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2"/></svg>My ECC / Login</a>
  </aside>;
}
