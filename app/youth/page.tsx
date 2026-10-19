import type { Metadata } from "next";
import Image from "next/image";
import TeamHeader from "../teams/team-header";
import s from "./youth.module.css";

export const metadata: Metadata = {
  title: "Youth Cricket | Eindhoven Cricket Club",
  description: "Your people. Your game. Your next adventure. Discover youth cricket at Eindhoven Cricket Club: a place to learn, make friends and grow together.",
};

const enquiry = "mailto:info@eindhovencc.com?subject=Youth%20cricket%20enquiry&body=Hello%20ECC%2C%0A%0AI%27d%20like%20to%20find%20out%20more%20about%20trying%20youth%20cricket.%0A%0A";
const steps = [
  ["Discover the game", "Learn the basics in a fun and friendly setting."],
  ["Find your team", "Make new friends and be part of a supportive group."],
  ["Grow together", "Build skills, confidence and great memories."],
];

function TryCricket() {
  return <a className={s.cta} href={enquiry}>Try cricket with us</a>;
}

export default function YouthPage() {
  return <>
    <TeamHeader />
    <main className={s.page} id="main-content">
      <section className={s.hero} aria-labelledby="youth-heading">
        <div className={s.heroCopy}>
          <p className={s.eyebrow}>Youth at Eindhoven Cricket Club</p>
          <h1 id="youth-heading">Your people.<br />Your game.<br />Your next<br /><em>adventure.</em></h1>
          <p className={s.intro}>A welcoming place for every young person to play cricket, make friends and be part of something special at Eindhoven Cricket Club.</p>
          <div className={s.actions}><TryCricket /><a className={s.textLink} href="#discover">Explore youth cricket</a></div>
        </div>
        <div className={s.collage}>
          <p className={`${s.note} ${s.teamwork}`}>Teamwork today.<br />Brighter tomorrows.</p>
          <figure className={s.heroPrint}>
            <div className={s.heroPhoto}><Image src="/images/youth/trophy-celebration.jpg" alt="ECC youth players celebrating together as they lift a trophy" fill sizes="(max-width: 760px) 85vw, 49vw" preload /></div>
            <figcaption>The moments we play for.</figcaption>
          </figure>
          <figure className={s.friendsPrint}>
            <div className={s.friendsPhoto}><Image src="/images/youth/friends-at-cricket.jpg" alt="Young ECC cricket fans enjoying a day at the ground together" width={946} height={2049} sizes="(max-width: 760px) 40vw, 22vw" /></div>
            <figcaption>Friends beyond the boundary.</figcaption>
          </figure>
        </div>
      </section>
      <div className={s.values} aria-label="What youth cricket is about"><span>Make friends</span><span>Find your confidence</span><span>Love the game</span></div>
      <section className={s.discover} id="discover" aria-labelledby="discover-heading">
        <figure className={s.teamPrint}>
          <Image src="/images/youth/team.jpg" alt="The ECC youth cricket team and their coaches together on the club ground" width={1600} height={1200} sizes="(max-width: 760px) 90vw, 52vw" />
          <figcaption>A team to belong to.</figcaption>
        </figure>
        <div className={s.discoverCopy}>
          <p className={s.eyebrow}>Play. Learn. Belong.</p>
          <h2 id="discover-heading">Every great story starts with a first game.</h2>
          <p>At Eindhoven Cricket Club, young people find a friendly, inclusive and supportive environment to learn, play and grow. Whether you’re new to cricket or already love the game, there’s a place for you here.</p>
          <ol className={s.steps}>{steps.map(([title, description], i) => <li key={title}><span className={s.stepNumber} aria-hidden="true">{i + 1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
        </div>
      </section>
      <section className={s.memories} aria-labelledby="memories-heading">
        <figure className={s.memoryPrint}>
          <Image src="/images/youth/meeting-players.jpg" alt="ECC youngsters meeting a cricket player and collecting autographs at the boundary" width={1491} height={1347} sizes="(max-width: 760px) 90vw, 53vw" />
          <figcaption>Inspiring moments. Lasting memories.</figcaption>
        </figure>
        <div className={s.memoriesCopy}>
          <h2 id="memories-heading">Big days.<br />Even bigger<br /><em>smiles.</em></h2>
          <p>From meeting players to cheering each other on, cricket at ECC is full of unforgettable moments. It’s a place to feel inspired, make friends and be part of a welcoming community.</p>
        </div>
      </section>
      <section className={s.family} aria-labelledby="family-heading">
        <div className={s.familyHeading}>
          <p className={s.eyebrow}>Our cricket family</p>
          <h2 id="family-heading">Together, beyond<br />the <em>boundary.</em></h2>
          <p>The people beside us. The moments we share. There’s more to cricket than what happens on the pitch.</p>
        </div>
        <div className={s.familyPhotos}>
          <figure className={s.familyPrint}>
            <Image src="/images/youth/cricket-family.jpg" alt="ECC parents and club supporters together on the cricket ground with a trophy" width={1600} height={1200} sizes="(max-width: 760px) 88vw, 52vw" />
            <figcaption>The people behind every innings.</figcaption>
          </figure>
          <figure className={s.boundaryPrint}>
            <Image src="/images/youth/beyond-the-boundary.jpg" alt="Young ECC fans meeting a cricket player beside the boundary at a cricket event" width={1549} height={1559} sizes="(max-width: 760px) 75vw, 34vw" />
            <figcaption>A little closer to the game.</figcaption>
          </figure>
        </div>
      </section>
      <section className={s.invitation} aria-labelledby="invitation-heading">
        <p className={`${s.note} ${s.closingNote}`} aria-hidden="true">Same people.<br />Brighter days.</p>
        <h2 id="invitation-heading">Come and give cricket <em>a go.</em></h2>
        <p>New to cricket? Everyone is welcome. Take the first step and be part of the ECC family.</p>
        <TryCricket />
        <p className={s.contactNote}>Opens an email to our club. Prefer a form? <a href="/contact">Get in touch</a>.</p>
      </section>
    </main>
    <footer className={s.footer}>
      <a className={s.footerBrand} href="/" aria-label="Eindhoven Cricket Club home"><Image src="/images/ecc-logo.png" width={37} height={44} alt="" /><span>Eindhoven Cricket Club<small>Established 1915</small></span></a>
      <nav aria-label="Footer navigation"><a href="/">Home</a><a href="/youth" aria-current="page">Youth</a><a href="/membership">Membership</a><a href="/contact">Contact</a></nav>
    </footer>
  </>;
}
