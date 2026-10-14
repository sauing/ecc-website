export type Fixture = {
  team: string;
  opponent: string;
  homeAway: "home" | "away";
  matchDate: string;
  startTime: string;
  venue: string;
  division: string;
  matchType: string;
  status: string;
  result?: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore?: string | null;
  awayScore?: string | null;
  sourceUrl?: string;
  sourceKey?: string;
};

const fixtureEndpoint = "https://ecc-season-app.vercel.app/api/kncb-matches";
const fixtureTeams = ["ECC1", "ECC2", "ECC3", "ECC4"] as const;
const fixtureRequestTimeoutMs = 8_000;

export async function getClubFixtures(): Promise<Fixture[]> {
  try {
    const results = await Promise.allSettled(
      fixtureTeams.map(async (team) => {
        const response = await fetch(`${fixtureEndpoint}?team=${team}&season=2026`, {
          next: { revalidate: 1800 },
          signal: AbortSignal.timeout(fixtureRequestTimeoutMs),
        });

        if (!response.ok) return { fixtures: [] };
        return response.json() as Promise<{ fixtures?: Fixture[] }>;
      }),
    );

    const payloads = results.map((result) =>
      result.status === "fulfilled" ? result.value : { fixtures: [] },
    );

    const allFixtures: Fixture[] = payloads.flatMap((payload) => payload.fixtures ?? []);
    const uniqueFixtures = new Map<string, Fixture>();

    for (const fixture of allFixtures) {
      const key = fixture.sourceKey || [
        fixture.matchDate,
        fixture.startTime,
        fixture.homeTeam,
        fixture.awayTeam,
      ].join(":");
      if (!uniqueFixtures.has(key)) uniqueFixtures.set(key, fixture);
    }

    return [...uniqueFixtures.values()].sort((a, b) =>
      `${a.matchDate}T${a.startTime}`.localeCompare(`${b.matchDate}T${b.startTime}`),
    );
  } catch {
    return [];
  }
}

export function selectFeaturedMatchday(fixtures: Fixture[]) {
  const today = new Date().toISOString().slice(0, 10);
  const dates = [...new Set(fixtures.map((fixture) => fixture.matchDate))].sort();
  const featuredDate = dates.find((date) => date >= today) ?? dates.at(-1);

  return {
    date: featuredDate ?? "2026-05-17",
    upcoming: Boolean(featuredDate && featuredDate >= today),
    fixtures: featuredDate
      ? fixtures.filter((fixture) => fixture.matchDate === featuredDate)
      : fallbackFixtures,
  };
}

const fallbackFixtures: Fixture[] = [
  {
    team: "ECC1",
    opponent: "VRA 1",
    homeAway: "home",
    matchDate: "2026-05-17",
    startTime: "11:00",
    venue: "Locatellistraat",
    division: "Hoofdklasse",
    matchType: "ODI",
    status: "scheduled",
    homeTeam: "Eindhoven",
    awayTeam: "VRA 1",
  },
  {
    team: "ECC2",
    opponent: "Sparta 2",
    homeAway: "away",
    matchDate: "2026-05-17",
    startTime: "12:00",
    venue: "Rotterdam",
    division: "Tweede Klasse",
    matchType: "ODI",
    status: "scheduled",
    homeTeam: "Sparta 2",
    awayTeam: "Eindhoven 2",
  },
  {
    team: "ECC4",
    opponent: "Quick 4",
    homeAway: "home",
    matchDate: "2026-05-17",
    startTime: "13:00",
    venue: "Locatellistraat",
    division: "Derde Klasse",
    matchType: "ODI",
    status: "scheduled",
    homeTeam: "Eindhoven 4",
    awayTeam: "Quick 4",
  },
];
