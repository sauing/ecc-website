"use client";
import { useState } from "react";
import s from "./social.module.css";

// Existing club account links, shared with the homepage. No live feed connection.
const instagram = "https://www.instagram.com/eindhovencc1915/";
const facebook = "https://www.facebook.com/Eindhoven-Cricket-Club-100388158821488";
type Channel = "All" | "Instagram" | "Facebook";

function ChannelLink({ channel, follow = false }: { channel: "Instagram" | "Facebook"; follow?: boolean }) {
  return <a href={channel === "Instagram" ? instagram : facebook} target="_blank" rel="noreferrer"><span aria-hidden="true">{channel === "Instagram" ? "◎" : "f"}</span>{follow ? "Follow on " : ""}{channel} <span aria-hidden="true">↗</span></a>;
}

export default function SocialHub() {
  const [channel, setChannel] = useState<Channel>("All");
  return <main className={s.page}>
    <section className={s.hero}>
      <div className={s.heroCopy}><span className={s.eyebrow}>Beyond the boundary</span><h1>LIFE AT ECC</h1><p>The people. The moments. The club.</p></div>
      <div className={s.heroLinks}><ChannelLink channel="Instagram" /><ChannelLink channel="Facebook" /></div>
      <img className={s.watermark} src="/images/ecc-logo.png" alt="" aria-hidden="true" />
    </section>
    <section className={s.content} aria-labelledby="inside-heading">
      <div className={s.heading}><h2 id="inside-heading">Inside the club</h2><div className={s.rule} /><div className={s.filters} role="group" aria-label="Choose social channel">{(["All", "Instagram", "Facebook"] as const).map(item => <button key={item} type="button" aria-pressed={channel === item} aria-controls="social-content" onClick={() => setChannel(item)}>{item}</button>)}</div></div>
      <div id="social-content">
        {channel === "All" ? <div className={s.featureGrid}>
          <figure className={s.feature}><img src="/images/gallery/seniors.jpg" alt="ECC senior cricket team" /><figcaption><span>ECC photo collection</span><h3>More than a match.</h3></figcaption></figure>
          <div className={s.sidebar}><article className={s.channelCard}><span className={s.eyebrow}>Facebook · Eindhoven Cricket Club</span><h3>From the clubhouse.</h3><p>Stay connected with the club. Explore updates and conversations on our Facebook page.</p><a className={s.textLink} href={facebook} target="_blank" rel="noreferrer">Visit Facebook ↗</a></article><div className={s.follow}><h3>One club.<br />Two ways to stay close.</h3><div><ChannelLink channel="Instagram" follow /><ChannelLink channel="Facebook" follow /></div></div></div>
        </div> : <article className={s.channelFocus}>
          <span className={s.eyebrow}>ECC on {channel}</span><h3>{channel === "Instagram" ? "The club, in pictures." : "From the clubhouse."}</h3><p>{channel === "Instagram" ? "Explore the club’s photos and videos on Instagram." : "Find club updates and community conversations on Facebook."}</p><ChannelLink channel={channel} follow /><p className={s.note}>Live posts are not connected here yet. Open our {channel} page for the latest posts.</p>
        </article>}
      </div>
      <div className={s.galleryHeading}><span>Club moments</span><span>From the ECC photo collection</span></div>
      <div className={s.gallery}>
        {[{ image: "about/match-action.jpg", title: "On the pitch.", alt: "Cricket action from the ECC photo collection" }, { image: "gallery/centre-pitch.jpg", title: "Our home ground.", alt: "The cricket pitch at ECC" }, { image: "about/community.jpg", title: "Our community.", alt: "ECC community gathering" }].map(photo => <a key={photo.image} className={s.photo} href={`/images/${photo.image}`} target="_blank" rel="noreferrer" aria-label={`View photo: ${photo.title}`}><img src={`/images/${photo.image}`} alt={photo.alt} loading="lazy" /><span>{photo.title}<small aria-hidden="true">↗</small></span></a>)}
      </div>
      <p className={s.note}>Photos above are from the club website collection, not a live social feed. Follow ECC on Instagram and Facebook for current posts.</p>
    </section>
  </main>;
}
