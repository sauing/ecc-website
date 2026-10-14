"use client";

import { useEffect, useState } from "react";

const slides = [
  { src: "/images/about/match-action.jpg", title: "Cricket with ambition", caption: "Competitive teams representing Eindhoven across the Dutch cricket pyramid." },
  { src: "/images/gallery/ground-opening.jpg", title: "Our home in Eindhoven", caption: "A welcoming ground built for competitive and community cricket." },
  { src: "/images/gallery/champions.jpg", title: "Championship character", caption: "Teams that compete together and celebrate together." },
  { src: "/images/gallery/seniors.jpg", title: "Four senior teams", caption: "A pathway for every level of ambition and experience." },
  { src: "/images/gallery/youth-1.jpg", title: "The next generation", caption: "Youth cricket focused on confidence, friendship and skill." },
  { src: "/images/gallery/centre-pitch.jpg", title: "Cricket at the centre", caption: "Training facilities and match days in the heart of Eindhoven." },
  { src: "/images/about/community.jpg", title: "Play, belong, grow", caption: "A multicultural club where every generation shares the game." },
];

const socialPosts = {
  instagram: [
    { image: "/images/gallery/champions.jpg", copy: "A season built on teamwork, commitment and unforgettable match days." },
    { image: "/images/gallery/youth-2.jpg", copy: "Youth cricket at ECC: learn the game, make friends and have fun." },
    { image: "/images/gallery/ground-opening.jpg", copy: "Home is where the crease is. Welcome to Eindhoven Cricket Club." },
  ],
  facebook: [
    { image: "/images/gallery/seniors.jpg", copy: "Another full weekend of cricket across our senior teams." },
    { image: "/images/gallery/youth-3.jpg", copy: "Community cricket starts with giving young players a place to belong." },
    { image: "/images/gallery/ground.jpg", copy: "Ground updates, fixtures and club events—all in one place." },
  ],
};

export function HomeSections() {
  const [slide, setSlide] = useState(0);
  const [network, setNetwork] = useState<"instagram" | "facebook">("instagram");

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = slides[slide];

  return (
    <>
      <section className="club-story" id="club">
        <div className="story-copy">
          <span className="section-kicker">More than a cricket club</span>
          <h2>One club.<br /><em>Many stories.</em></h2>
          <p>Eindhoven Cricket Club was founded in 1915 and is one of the oldest cricket clubs in the Netherlands. Our international community brings together senior, women&apos;s and youth players through a shared love of cricket.</p>
          <div className="story-stats">
            <div><strong>1915</strong><span>Founded</span></div>
            <div><strong>4</strong><span>Senior teams</span></div>
            <div><strong>2</strong><span>Youth pathways</span></div>
          </div>
          <a href="/about">Discover our story <span>→</span></a>
        </div>

        <div className="slideshow" aria-label="ECC photo slideshow">
          <img src={activeSlide.src} alt={activeSlide.title} />
          <div className="slide-caption">
            <span>{String(slide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
            <h3>{activeSlide.title}</h3>
            <p>{activeSlide.caption}</p>
          </div>
          <div className="slide-controls">
            <button type="button" aria-label="Previous photo" onClick={() => setSlide((slide - 1 + slides.length) % slides.length)}>←</button>
            <div className="slide-dots">
              {slides.map((item, index) => <button key={item.src} type="button" aria-label={`Show photo ${index + 1}`} className={slide === index ? "active" : ""} onClick={() => setSlide(index)} />)}
            </div>
            <button type="button" aria-label="Next photo" onClick={() => setSlide((slide + 1) % slides.length)}>→</button>
          </div>
        </div>
      </section>

      <section className="social-wall" id="social">
        <div className="social-heading">
          <div>
            <span className="section-kicker">From the boundary</span>
            <h2>Follow the club</h2>
          </div>
          <div className="social-tabs" role="tablist" aria-label="Social networks">
            <button type="button" role="tab" aria-selected={network === "instagram"} className={network === "instagram" ? "active" : ""} onClick={() => setNetwork("instagram")}>Instagram</button>
            <button type="button" role="tab" aria-selected={network === "facebook"} className={network === "facebook" ? "active" : ""} onClick={() => setNetwork("facebook")}>Facebook</button>
          </div>
        </div>
        <div className="social-grid">
          {socialPosts[network].map((post, index) => (
            <article className="social-card" key={`${network}-${post.image}`}>
              <img src={post.image} alt="ECC club activity" />
              <div><span>{network === "instagram" ? "◎" : "f"} @eindhovencc1915</span><p>{post.copy}</p><small>Club update {index + 1}</small></div>
            </article>
          ))}
        </div>
        <a className="social-follow" href={network === "instagram" ? "https://www.instagram.com/eindhovencc1915/" : "https://www.facebook.com/Eindhoven-Cricket-Club-100388158821488"} target="_blank" rel="noreferrer">Follow on {network === "instagram" ? "Instagram" : "Facebook"} <span>→</span></a>
      </section>
    </>
  );
}
