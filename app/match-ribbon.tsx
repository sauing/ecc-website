"use client";

import { useState } from "react";
import styles from "./match-ribbon.module.css";
import type { Fixture } from "./fixtures";

export function MatchRibbon({
  fixtures,
  date,
  upcoming,
}: {
  fixtures: Fixture[];
  date: string;
  upcoming: boolean;
}) {
  const [active, setActive] = useState(0);
  const fixture = fixtures[Math.min(active, fixtures.length - 1)];
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));

  if (!fixture) return null;

  return (
    <section className={styles.ribbon} aria-label="Featured matchday">
      <div className={styles.identity}>
        <img src="/images/ecc-logo.png" alt="Eindhoven Cricket Club crest" />
        <span>Eindhoven<br />Cricket Club</span>
      </div>
      <div className={styles.matchday}>
        <span>{upcoming ? "Next" : "Latest"}</span>
        <strong>Matchday</strong>
      </div>
      <div className={styles.count}><strong>{fixtures.length}</strong><span>{fixtures.length === 1 ? "Fixture" : "Fixtures"}</span></div>
      <div className={styles.match}>
      <div className={styles.switcher} role="group" aria-label="Matches on this date">
        {fixtures.map((item, index) => (
          <button
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            key={`${item.team}-${item.opponent}-${item.startTime}`}
          >
            {item.team}
          </button>
        ))}
      </div>

      <div className={styles.teams}>
        <span>{fixture.homeTeam}</span>
        <b>vs</b>
        <span>{fixture.awayTeam}</span>
      </div>

      <div className={styles.meta}>
        <span>{formattedDate} · {fixture.startTime}</span>
        <span>{fixture.venue}</span>
      </div>
      </div>
      <div className={styles.action}>
      <a href={fixture.sourceUrl || "#fixtures"} target="_blank" rel="noreferrer">
        Match centre <span>→</span>
      </a>
      </div>
    </section>
  );
}
