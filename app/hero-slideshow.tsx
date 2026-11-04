"use client";

import { useEffect, useState } from "react";
import { clubPhotos } from "./club-photos";

const slides = [
  "/images/club-3.jpg",
  "/images/gallery/champions.jpg",
  "/images/gallery/ground-opening.jpg",
  "/images/gallery/seniors.jpg",
  ...clubPhotos.map((photo) => photo.src),
];

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="hero-slideshow" aria-label="ECC club photos">
    {slides.map((src, index) => <img key={src} src={src} alt="" className={index === active ? "active" : ""} />)}
  </div>;
}
