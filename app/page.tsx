import TeamHeader from "./teams/team-header";
import { getClubFixtures, selectFeaturedMatchday } from "./fixtures";
import { MatchRibbon } from "./match-ribbon";
import { HomeSections } from "./home-sections";
import { HeroSlideshow } from "./hero-slideshow";

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
        <a className="feature feature-youth" id="youth" href="#">
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
          <span>Backing cricket in Eindhoven</span>
          <h2 id="sponsors-title">Our partners</h2>
        </div>
        <div className="sponsor-list">
          <a href="https://financieelnext.nl/" target="_blank" rel="noreferrer" aria-label="Visit FinancieelNext">
            <img src="/images/sponsors/financieelnext.png" alt="FinancieelNext" />
          </a>
          <a href="https://gardengate.nl/" target="_blank" rel="noreferrer" aria-label="Visit GardenGate">
            <img src="/images/sponsors/gardengate.png" alt="GardenGate" />
          </a>
          <a href="https://the-indian-pantry.dinemetrics.app/restaurant/63" target="_blank" rel="noreferrer" aria-label="Visit Indian Pantry">
            <img src="/images/sponsors/indian-pantry.jpg" alt="Indian Pantry" />
          </a>
        </div>
        <a className="sponsor-cta" href="#sponsor">Become a partner <span>→</span></a>
      </section>
    </main>
  );
}
