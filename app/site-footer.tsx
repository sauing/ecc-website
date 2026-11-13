import s from "./site-footer.module.css";

export default function SiteFooter() {
  return <footer className={s.footer}>
    <a className={s.crest} href="/" aria-label="Eindhoven Cricket Club home"><img src="/images/ecc-logo.png" alt="" /></a>
    <div className={s.columns}>
      <nav className={s.column} aria-label="About the club">
        <h2>About</h2>
        <a href="/about">About ECC</a>
        <a href="/social">News</a>
        <a href="/youth">Youth cricket</a>
      </nav>
      <nav className={s.column} aria-label="Cricket">
        <h2>Cricket</h2>
        <a href="/teams/ecc1">Our teams</a>
        <a href="/stats">Player stats</a>
        <a href="/tournaments">Tournaments</a>
        <a href="/#fixtures">Fixtures &amp; results</a>
      </nav>
      <nav className={s.column} aria-label="Get involved">
        <h2>Get involved</h2>
        <a href="/join">Join the club</a>
        <a href="/membership">Membership</a>
        <a href="/partners">Our partners</a>
      </nav>
      <div className={s.column}>
        <h2>Contact us</h2>
        <address className={s.address}>Locatellistraat 3<br />5654 JB Eindhoven<br />North Brabant, Netherlands</address>
        <a href="mailto:info@eindhovencc.com">info@eindhovencc.com</a>
        <a href="/contact">Contact the club</a>
      </div>
    </div>
    <div className={s.bottom}>
      <span>© {new Date().getFullYear()} Eindhoven Cricket Club</span>
      <span>Established 1915 · Eindhoven</span>
    </div>
  </footer>;
}
