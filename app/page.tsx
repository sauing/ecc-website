import TeamHeader from "./teams/team-header";
import { getClubFixtures, selectFeaturedMatchday } from "./fixtures";
import { MatchRibbon } from "./match-ribbon";
import { HomeSections } from "./home-sections";
import { HeroSlideshow } from "./hero-slideshow";
import { partners } from "./partners/partners";

export default async function Home() {
  const matchday = selectFeaturedMatchday(await getClubFixtures());

  return (
    <main>
      <TeamHeader />

      <section className="hero" id="top">
        <HeroSlideshow />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">Established 1915 · Eindhoven</p>
          <h1>Cricket<br /><em>lives</em> here.</h1>
          <p>Eindhoven&apos;s cricket community since 1915.</p>
        </div>
        <div className="crease" aria-hidden="true" />
      </section>

      <MatchRibbon {...matchday} />

      <section className="feature-grid" aria-label="Explore Eindhoven Cricket Club">
        <a className="feature feature-fixtures" id="fixtures" href="#">
          <span className="feature-number">01</span>
          <div>
            <h2>Fixtures &amp;<br />Results</h2>
            <span className="feature-arrow">→</span>
          </div>
        </a>
        <a className="feature feature-join" id="membership" href="/join">
          <span className="feature-number">02</span>
          <div>
            <h2>Join<br />the Club</h2>
            <span className="feature-arrow">→</span>
          </div>
          <small>People · Friendship · Cricket for life</small>
        </a>
        <a className="feature feature-youth" id="youth" href="/youth">
          <span className="feature-number">03</span>
          <div>
            <h2>Youth<br />Cricket</h2>
            <span className="feature-arrow">→</span>
          </div>
          <small>Skills · Friends · A brighter tomorrow</small>
        </a>
      </section>

      <HomeSections />

      <section className="sponsors" aria-labelledby="sponsors-title">
        <div className="sponsors-heading">
          <span>Backing cricket in Eindhoven area</span>
          <h2 id="sponsors-title"><a href="/partners">Our partners</a></h2>
        </div>
        <div className="sponsor-featured" role="group" aria-label="Featured partners">
          <a className="sponsor-featured-logo" href={partners[0].website} target="_blank" rel="noreferrer" aria-label={`Visit ${partners[0].name}`}><img src={partners[0].logo} alt={partners[0].name} /></a>
          <div className="kncb-placeholder" role="img" aria-label="Temporary KNCB logo placeholder"><span className="kncb-seal" aria-hidden="true">✦</span><span className="kncb-wordmark"><strong>KNCB</strong><small>TEMPORARY MARK</small></span></div>
        </div>
        <div className="sponsor-list" role="group" aria-label="Other partners">
          {partners.slice(1).map(partner => <a key={partner.name} href={partner.website} target="_blank" rel="noreferrer" aria-label={`Visit ${partner.name}`}><img src={partner.logo} alt={partner.name} /></a>)}
          {[1, 2, 3, 4].map(number => <div className={`sponsor-placeholder sponsor-placeholder-${number}`} key={number} role="img" aria-label={`Temporary partner logo ${number}`}><span className="sponsor-placeholder-mark" aria-hidden="true">ECC</span><span>PARTNER <strong>0{number}</strong></span></div>)}
        </div>
        <a className="sponsor-cta" href="/partners#partnership-enquiry">Become a partner <span>→</span></a>
      </section>
    </main>
  );
}
