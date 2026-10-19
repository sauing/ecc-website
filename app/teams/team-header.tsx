"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import s from "./site-header.module.css";
import NoticeBar from "../notice-bar";

const teams = ["ecc1","ecc2","ecc3","ecc4","youth-1","youth-2"];
const links = [["/about","Club"],["/stats","Stats"],["/tournaments","Tournaments"],["/youth","Youth"],["/partners","Partners"],["/membership","Membership"],["/contact","Contacts"],["/social","Social"]];
export default function TeamHeader() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const mastheadRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const masthead = mastheadRef.current;
    if (!masthead) return;
    // Measure the real height, including wrapped notices and loaded fonts.
    // Negative sticky offset lets branding scroll away without layout jumps.
    const updateCompact = () => setCompact(window.innerWidth > 800 && masthead.getBoundingClientRect().bottom <= 1);
    const measure = () => {
      headerRef.current?.style.setProperty("--masthead-height", `${masthead.getBoundingClientRect().height}px`);
      updateCompact();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(masthead);
    window.addEventListener("scroll", updateCompact, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateCompact);
      window.removeEventListener("resize", measure);
    };
  }, []);
  const link = ([href,label]: string[]) => <a key={href} href={href} aria-current={pathname===href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</a>;
  const teamLinks = teams.map(t=><a key={t} href={`/teams/${t}`} aria-current={pathname===`/teams/${t}` ? "page" : undefined}>{t.replace("-"," ").toUpperCase()}</a>);
  return <header className={s.header} ref={headerRef}>
    <div ref={mastheadRef}>
    <NoticeBar />
    <div className={s.inner}>
      <a className={s.brand} href="/" aria-label="Eindhoven Cricket Club home"><img src="/images/ecc-logo.png" alt="ECC crest"/><div className={s.wordmark}><span>Eindhoven Cricket Club</span><small>Established 1915 <i aria-hidden="true">·</i> Eindhoven</small></div></a>
      <a className={s.join} href="/join">Join ECC <span aria-hidden="true">↗</span></a>
    </div>
    </div>
      <nav className={s.nav} data-compact={compact} aria-label="Main navigation">
        {compact && <a className={s.compactBrand} href="/" aria-label="Eindhoven Cricket Club home"><img src="/images/ecc-logo.png" alt="ECC crest" /></a>}
        {links.slice(0,2).map(link)}
        <details className={s.menu}><summary data-active={pathname.startsWith("/teams")}>Teams <span>▾</span></summary><div className={s.dropdown}>{teamLinks}</div></details>
        {links.slice(2).map(link)}
        {compact && <a className={s.compactJoin} href="/join">Join ECC <span aria-hidden="true">↗</span></a>}
      </nav>
    <details className={s.mobile}><summary>Menu</summary><nav aria-label="Mobile navigation">{links.map(link)}{teamLinks}<a href="/login">My ECC / Login</a></nav></details>
  </header>;
}
