"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import s from "./site-header.module.css";
import NoticeBar from "../notice-bar";

const teams = ["ecc1","ecc2","ecc3","ecc4","youth-1","youth-2"];
const links = [["/about","Club"],["/stats","Stats"],["/youth","Youth"],["/membership","Membership"],["/contact","Contacts"],["/social","Social"]];
export default function TeamHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const mastheadRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const masthead = mastheadRef.current;
    if (!masthead) return;
    // Measure the real height, including wrapped notices and loaded fonts.
    // Negative sticky offset lets branding scroll away without layout jumps.
    const measure = () => headerRef.current?.style.setProperty("--masthead-height", `${masthead.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(masthead);
    return () => observer.disconnect();
  }, []);
  const link = ([href,label]: string[]) => <a key={href} href={href} aria-current={pathname===href ? "page" : undefined}>{label}</a>;
  const teamLinks = teams.map(t=><a key={t} href={`/teams/${t}`} aria-current={pathname===`/teams/${t}` ? "page" : undefined}>{t.replace("-"," ").toUpperCase()}</a>);
  return <header className={s.header} ref={headerRef}>
    <div ref={mastheadRef}>
    <NoticeBar />
    <div className={s.inner}>
      <a className={s.brand} href="/" aria-label="Eindhoven Cricket Club home"><img src="/images/ecc-logo.png" alt="ECC crest"/><div className={s.wordmark}><span>Eindhoven Cricket Club</span><small>Established 1915 <i aria-hidden="true">·</i> Eindhoven</small></div></a>
      <a className={s.join} href="/join">Join ECC <span aria-hidden="true">↗</span></a>
    </div>
    </div>
      <nav className={s.nav} aria-label="Main navigation">
        {links.slice(0,2).map(link)}
        <details className={s.menu}><summary data-active={pathname.startsWith("/teams")}>Teams <span>▾</span></summary><div className={s.dropdown}>{teamLinks}</div></details>
        {links.slice(2).map(link)}
      </nav>
    <details className={s.mobile}><summary>Menu</summary><nav aria-label="Mobile navigation">{links.map(link)}{teamLinks}<a href="/login">My ECC / Login</a></nav></details>
  </header>;
}
