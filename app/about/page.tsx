import TeamHeader from "../teams/team-header";

export const metadata = {
  title: "About ECC | Eindhoven Cricket Club",
  description: "The history, mission and community of Eindhoven Cricket Club since 1915.",
};

const milestones = [
  ["1915", "Philips Cricket Club is founded, establishing ECC's cricketing roots."],
  ["1923", "The club becomes part of the Eindhoven multi-sport community."],
  ["2000", "Cricket separates from PSV and continues as Eindhoven Cricket Club."],
  ["2016–17", "Back-to-back championships bring promotion to Eerste Klasse."],
  ["2018–24", "Senior and youth teams expand as the club builds long-term stability."],
  ["2025", "ECC finishes second in both Eerste Klasse formats and earns promotion to Hoofdklasse."],
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <TeamHeader />

      <section className="about-hero">
        <img src="/images/about/match-action.jpg" alt="ECC batter playing a shot" />
        <div className="about-hero-overlay" />
        <div className="about-hero-copy"><span>North Brabant · Since 1915</span><h1>Play.<br /><em>Belong.</em><br />Grow.</h1><p>One of the Netherlands&apos; oldest cricket clubs, built for sporting ambition and community connection.</p></div>
      </section>

      <section className="about-intro" id="history">
        <div><span className="section-kicker">Our club</span><h2>Cricket in Eindhoven<br />for over a century.</h2></div>
        <div><p>Established in 1915, Eindhoven Cricket Club is officially recognized and supported by the KNCB and Gemeente Eindhoven. Located near the High Tech Campus, ECC is a multicultural home for players, families and supporters from across the Brainport region.</p><p>The club fields four senior teams and two youth teams, while continuing to develop opportunities for women and girls.</p></div>
      </section>

      <section className="about-numbers" aria-label="Club facts">
        <div><strong>95+</strong><span>Club members</span></div><div><strong>4</strong><span>Senior teams</span></div><div><strong>2</strong><span>Youth teams</span></div><div><strong>1915</strong><span>Founded</span></div>
      </section>

      <section className="history-section">
        <div className="history-heading"><span className="section-kicker">Our journey</span><h2>From Philips roots<br />to Hoofdklasse.</h2></div>
        <div className="timeline">{milestones.map(([year, copy]) => <article key={year}><strong>{year}</strong><p>{copy}</p></article>)}</div>
      </section>

      <section className="mission-section" id="mission">
        <div className="mission-image"><img src="/images/about/community.jpg" alt="ECC members and youth players celebrating together" /></div>
        <div className="mission-copy"><span className="section-kicker">Mission &amp; vision</span><h2>Competitive cricket.<br />Stronger community.</h2><p>Our mission is to play cricket at the highest level of the Dutch league while building a strong, inclusive and sustainable club in Brainport.</p><ul><li>Sustain a team competing at the highest level of Dutch cricket.</li><li>Develop regional talent and clear youth pathways.</li><li>Expand opportunities for women and girls.</li><li>Use cricket to connect Eindhoven&apos;s international community.</li></ul></div>
      </section>

      <section className="community-section" id="community">
        <span className="section-kicker">Beyond match day</span><h2>A platform for participation.</h2>
        <div className="community-grid"><article><b>01</b><h3>Youth development</h3><p>School clinics, cricket camps and coaching programmes that build confidence and teamwork.</p></article><article><b>02</b><h3>Inclusive cricket</h3><p>A welcoming environment for every background, with growing pathways for women and girls.</p></article><article><b>03</b><h3>Tournaments</h3><p>Indoor and outdoor competitions welcoming teams from the Netherlands, Belgium and Germany.</p></article></div>
        <a href="/join">Become part of ECC <span>→</span></a>
      </section>
    </main>
  );
}
