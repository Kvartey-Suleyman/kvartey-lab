export type Attributes = {
  speed: number;
  shot: number;
  finish: number;
  pass: number;
  dribble: number;
  power: number;
  stamina: number;
};
export type Profile = {
  name: string;
  country: string;
  age: number;
  height: number;
  position: string;
  potential: number;
};
export const attrNames: Record<keyof Attributes, string> = {
  speed: "Hız",
  shot: "Şut",
  finish: "Bitiricilik",
  pass: "Pas",
  dribble: "Dripling",
  power: "Fiziksel güç",
  stamina: "Dayanıklılık",
};
export const clubs = [
  {
    name: "Kıyıspor",
    strength: 58,
    prestige: 2,
    budget: 1200000,
    need: "Düzenli ilk 11",
    league: "Ufuk Ligi",
  },
  {
    name: "Anadolu FK",
    strength: 66,
    prestige: 3,
    budget: 4500000,
    need: "Rotasyon",
    league: "Ufuk Ligi",
  },
  {
    name: "İstanbul Yıldızları",
    strength: 80,
    prestige: 5,
    budget: 30000000,
    need: "Genç yetenek",
    league: "Ufuk Ligi",
  },
  {
    name: "Ege Birliği",
    strength: 63,
    prestige: 3,
    budget: 3000000,
    need: "İlk 11 rekabeti",
    league: "Ufuk Ligi",
  },
  {
    name: "Başkent Atletik",
    strength: 74,
    prestige: 4,
    budget: 14000000,
    need: "Rotasyon",
    league: "Ufuk Ligi",
  },
  {
    name: "Toros SK",
    strength: 61,
    prestige: 2,
    budget: 2000000,
    need: "Düzenli ilk 11",
    league: "Ufuk Ligi",
  },
  {
    name: "Marmara 1923",
    strength: 71,
    prestige: 4,
    budget: 9000000,
    need: "İlk 11 rekabeti",
    league: "Ufuk Ligi",
  },
  {
    name: "Kuzey Gücü",
    strength: 68,
    prestige: 3,
    budget: 6000000,
    need: "Rotasyon",
    league: "Ufuk Ligi",
  },
];
export type Row = {
  club: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  goals: number;
  assists: number;
};
export type Fixture = { home: number; away: number };
export type Match = {
  minute: number;
  home: number;
  away: number;
  homeGoals: number;
  awayGoals: number;
  goals: number;
  assists: number;
  shots: number;
  minutes: number;
  rating: number;
  starter: boolean;
  entered: boolean;
  pending: boolean;
  finished: boolean;
  decisionCount: number;
  before: { overall: number; form: number; morale: number };
  growth: { overall: number; form: number; morale: number };
  log: string[];
};
export type Offer = {
  club: number;
  salary: number;
  fee: number;
  years: number;
  minutes: number;
};
export type SeasonRecord = {
  season: number;
  club: number;
  games: number;
  goals: number;
  assists: number;
  overall: number;
  place: number;
  trophy: string;
};
export type Career = {
  version: 1;
  profile: Profile;
  attributes: Attributes;
  club: number;
  seasonClub: number;
  path: number;
  season: number;
  week: number;
  seed: number;
  form: number;
  morale: number;
  energy: number;
  trust: number;
  games: number;
  goals: number;
  assists: number;
  table: Row[];
  fixtures: Fixture[][];
  match: Match | null;
  last: Match | null;
  news: string[];
  history: SeasonRecord[];
  transfers: string[];
  offers: Offer[];
  trained: boolean;
  salary: number;
  contract: number;
  tactic: string;
  retired: boolean;
  matchHistory: { season: number; week: number; club: number; result: Match }[];
};
export const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));
export function random(c: { seed: number }) {
  c.seed = (Math.imul(c.seed, 1664525) + 1013904223) >>> 0;
  return c.seed / 4294967296;
}
export function overall(c: Career) {
  return Math.round(Object.values(c.attributes).reduce((a, b) => a + b, 0) / 7);
}
export function value(c: Career) {
  return (
    Math.round(
      (250000 *
        Math.pow(overall(c) / 62, 5) *
        (1 + c.goals * 0.035) *
        (c.profile.age > 30 ? 0.75 : 1)) /
        1000,
    ) * 1000
  );
}
export function schedule(): Fixture[][] {
  let ids = [0, 1, 2, 3, 4, 5, 6, 7];
  const rounds: Fixture[][] = [];
  for (let r = 0; r < 7; r++) {
    rounds.push(
      Array.from({ length: 4 }, (_, i) =>
        r % 2
          ? { home: ids[7 - i], away: ids[i] }
          : { home: ids[i], away: ids[7 - i] },
      ),
    );
    ids = [ids[0], ids[7], ...ids.slice(1, 7)];
  }
  return [
    ...rounds,
    ...rounds.map((round) =>
      round.map((m) => ({ home: m.away, away: m.home })),
    ),
  ];
}
export function table(): Row[] {
  return clubs.map((_, club) => ({
    club,
    played: 0,
    won: 0,
    draw: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    points: 0,
    goals: 0,
    assists: 0,
  }));
}
export function ranking(c: Career) {
  return [...c.table].sort(
    (a, b) => b.points - a.points || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf,
  );
}
export function createCareer(
  profile: Profile,
  path: number,
  seed = Date.now() >>> 0,
): Career {
  return {
    version: 1,
    profile: {
      ...profile,
      name: profile.name.trim().slice(0, 30) || "KVARTEY",
      age: clamp(profile.age, 16, 35),
      height: clamp(profile.height, 150, 210),
      potential: clamp(profile.potential, 62, 99),
    },
    attributes: {
      speed: 66,
      shot: 62,
      finish: 64,
      pass: 59,
      dribble: 65,
      power: 55,
      stamina: 63,
    },
    club: path,
    seasonClub: path,
    path,
    season: 1,
    week: 0,
    seed,
    form: 65,
    morale: 75,
    energy: 100,
    trust: path === 0 ? 80 : path === 1 ? 60 : 40,
    games: 0,
    goals: 0,
    assists: 0,
    table: table(),
    fixtures: schedule(),
    match: null,
    last: null,
    news: [
      "Yeni bir hikâye başlıyor. Teknik direktör ilk antrenmanını bekliyor.",
    ],
    history: [],
    transfers: [],
    offers: [],
    trained: false,
    salary: 1000,
    contract: 3,
    tactic: "Dengeli",
    retired: false,
    matchHistory: [],
  };
}
export function train(c: Career, key: keyof Attributes | "balanced") {
  if (c.trained || c.match || c.retired || c.week >= 14) return c;
  const n = structuredClone(c);
  const room = Math.max(0, n.profile.potential - overall(n));
  const age = n.profile.age <= 23 ? 1 : n.profile.age <= 29 ? 0.7 : 0.25;
  for (const k of Object.keys(n.attributes) as (keyof Attributes)[])
    if (key === "balanced" || k === key)
      n.attributes[k] = Math.min(
        n.profile.potential,
        n.attributes[k] +
          Math.min(
            room,
            age *
              (n.path === 0 ? 1.12 : n.path === 2 ? 1.2 : 1) *
              (key === "balanced" ? 0.12 : 0.65),
          ),
      );
  n.energy = clamp(n.energy - 7);
  n.trust = clamp(n.trust + 2);
  n.trained = true;
  return n;
}
export function startMatch(c: Career) {
  if (c.match || c.week >= 14 || c.retired) return c;
  const n = structuredClone(c);
  const f = n.fixtures[n.week].find(
    (f) => f.home === n.club || f.away === n.club,
  )!;
  const starter =
    random(n) <
    clamp((overall(n) - clubs[n.club].strength) * 2 + n.trust, 15, 95) / 100;
  n.match = {
    ...f,
    minute: 0,
    homeGoals: 0,
    awayGoals: 0,
    goals: 0,
    assists: 0,
    shots: 0,
    minutes: 0,
    rating: 6,
    starter,
    entered: starter,
    pending: false,
    finished: false,
    decisionCount: 0,
    before: { overall: overall(n), form: n.form, morale: n.morale },
    growth: { overall: 0, form: 0, morale: 0 },
    log: [
      starter
        ? "İlk 11’desin. Hakem başlangıç düdüğünü çaldı."
        : "Yedek kulübesindesin. Isınmaya başla.",
    ],
  };
  return n;
}
function poisson(c: Career, rate: number) {
  let p = 1,
    k = 0;
  do {
    k++;
    p *= random(c);
  } while (p > Math.exp(-rate));
  return k - 1;
}
function score(c: Career, h: number, a: number, hg: number, ag: number) {
  const hr = c.table[h],
    ar = c.table[a];
  for (const [x, gf, ga] of [
    [hr, hg, ag],
    [ar, ag, hg],
  ] as [Row, number, number][]) {
    x.played++;
    x.gf += gf;
    x.ga += ga;
    if (gf > ga) {
      x.won++;
      x.points += 3;
    } else if (gf === ga) {
      x.draw++;
      x.points++;
    } else x.lost++;
  }
}
export function advance(c: Career, choice?: string, auto = false): Career {
  if (!c.match || c.match.finished) return c;
  const n = structuredClone(c),
    m = n.match!;
  if (m.pending) {
    if (!choice && !auto) return c;
    const action = choice || "Şut çek";
    m.pending = false;
    m.decisionCount++;
    const defense = clubs[m.home === n.club ? m.away : m.home].strength;
    const skill =
      action === "Pas ver"
        ? n.attributes.pass
        : action === "Çalım dene"
          ? n.attributes.dribble
          : action === "Topu sakla"
            ? n.attributes.power
            : action === "Riskli hücum"
              ? n.attributes.speed
              : n.attributes.finish * 0.65 + n.attributes.shot * 0.35;
    const roleBonus =
      n.profile.position === "Forvet" && action === "Şut çek"
        ? 3
        : n.profile.position === "Orta saha" && action === "Pas ver"
          ? 4
          : n.profile.position === "Kanat" && action === "Çalım dene"
            ? 4
            : 0;
    const chance =
      clamp(
        27 +
          roleBonus +
          (skill - defense) * 0.6 +
          (n.form - 50) * 0.12 +
          (n.morale - 50) * 0.08 +
          (n.energy - 60) * 0.1 +
          (n.tactic === "Hücum" ? 7 : 0),
        6,
        65,
      ) / 100;
    if (action === "Topu sakla") {
      n.energy = clamp(n.energy + 3);
      n.trust = clamp(n.trust + 1);
      m.log.unshift(`${m.minute}′ Topu korudun, takım nefes aldı.`);
    } else {
      m.shots += action === "Pas ver" ? 0 : 1;
      if (random(n) < chance * (action === "Riskli hücum" ? 1.15 : 1)) {
        if (m.home === n.club) m.homeGoals++;
        else m.awayGoals++;
        if (action === "Pas ver") {
          m.assists++;
          m.log.unshift(`${m.minute}′ Asist! Savunma arkasına harika pas.`);
        } else {
          m.goals++;
          m.log.unshift(`${m.minute}′ GOOOL! ${n.profile.name} ağları buldu.`);
        }
        m.rating += 0.65;
      } else {
        m.log.unshift(
          `${m.minute}′ ${action}: ${random(n) < 0.5 ? "kaleci kurtardı." : "savunma araya girdi."}`,
        );
        m.rating -= 0.08;
        if (action === "Riskli hücum" && random(n) < 0.25) {
          if (m.home === n.club) m.awayGoals++;
          else m.homeGoals++;
          m.log.unshift("Riskli top kaybı sonrası rakip golü buldu.");
        }
      }
    }
  }
  for (let i = 0; i < 5 && m.minute < 90; i++) {
    m.minute++;
    if (!m.entered && m.minute === 60 && random(n) < 0.8) {
      m.entered = true;
      m.log.unshift("60′ Oyuna girdin. Kendini göster!");
    }
    if (m.entered) {
      m.minutes++;
      n.energy = clamp(n.energy - 0.22);
    }
    const homeStrength =
      clubs[m.home].strength +
      4 +
      (m.home === n.club ? (overall(n) - 62) * 0.2 : 0);
    const awayStrength =
      clubs[m.away].strength +
      (m.away === n.club ? (overall(n) - 62) * 0.2 : 0);
    const tempo =
      n.tactic === "Hücum" ? 1.2 : n.tactic === "Kontrollü" ? 0.82 : 1;
    if (random(n) < 0.021 * tempo) {
      const homeGoal =
        random(n) <
        clamp(0.5 + (homeStrength - awayStrength) * 0.009, 0.2, 0.8);
      if (homeGoal) m.homeGoals++;
      else m.awayGoals++;
      m.log.unshift(
        `${m.minute}′ ${clubs[homeGoal ? m.home : m.away].name} golü buldu.`,
      );
    }
    if (m.entered && [17, 38, 67, 83].includes(m.minute)) {
      m.pending = true;
      m.log.unshift(`${m.minute}′ Kritik pozisyon! Kararını ver.`);
      break;
    }
    if (m.minute === 45) m.log.unshift("45′ Devre arası.");
    if (m.entered && random(n) < 0.002)
      m.log.unshift(`${m.minute}′ Sert müdahale: sarı kart.`);
  }
  if (m.minute >= 90) {
    m.finished = true;
    m.pending = false;
    m.rating = clamp(
      m.rating +
        (m.minutes / 90) * 0.5 +
        (m.home === n.club
          ? m.homeGoals - m.awayGoals
          : m.awayGoals - m.homeGoals) *
          0.12,
      3,
      10,
    );
    m.log.unshift("90′ Maç sona erdi.");
    finish(n);
  }
  return n;
}
function finish(n: Career) {
  const m = n.match!;
  score(n, m.home, m.away, m.homeGoals, m.awayGoals);
  for (const f of n.fixtures[n.week]) {
    if (f.home === n.club || f.away === n.club) continue;
    const hg = poisson(
        n,
        1.35 + (clubs[f.home].strength - clubs[f.away].strength) * 0.015,
      ),
      ag = poisson(
        n,
        1.1 + (clubs[f.away].strength - clubs[f.home].strength) * 0.015,
      );
    score(n, f.home, f.away, hg, ag);
    n.table[f.home].goals += Math.min(hg, poisson(n, 0.5));
    n.table[f.away].goals += Math.min(ag, poisson(n, 0.5));
    n.table[f.home].assists += Math.min(hg, poisson(n, 0.4));
    n.table[f.away].assists += Math.min(ag, poisson(n, 0.4));
  }
  n.games += m.minutes > 0 ? 1 : 0;
  n.goals += m.goals;
  n.assists += m.assists;
  n.table[n.club].goals += m.goals;
  n.table[n.club].assists += m.assists;
  n.form = clamp(n.form + (m.rating - 6) * 4);
  n.morale = clamp(n.morale + (m.rating - 6) * 3);
  n.trust = clamp(n.trust + (m.rating - 6) * 3);
  n.energy = clamp(n.energy + 22);
  const gain =
    (Math.max(0, n.profile.potential - overall(n)) / 24) *
    (0.04 + m.minutes / 900) *
    (n.profile.age < 25 ? 1 : 0.45);
  for (const k of Object.keys(n.attributes) as (keyof Attributes)[])
    n.attributes[k] = Math.min(n.profile.potential, n.attributes[k] + gain);
  m.growth = {
    overall: overall(n) - m.before.overall,
    form: n.form - m.before.form,
    morale: n.morale - m.before.morale,
  };
  n.matchHistory.push({
    season: n.season,
    week: n.week + 1,
    club: n.club,
    result: structuredClone(m),
  });
  n.week++;
  n.trained = false;
  n.last = structuredClone(m);
  n.news.unshift(
    `${n.week}. hafta: ${clubs[m.home].name} ${m.homeGoals}–${m.awayGoals} ${clubs[m.away].name}. Puanın: ${m.rating.toFixed(1)}`,
  );
  n.news = n.news.slice(0, 12);
  if (n.week === 5 || n.week === 10 || n.week === 14)
    n.offers = clubs
      .map((club, i) => ({
        club: i,
        salary: Math.round(1000 + club.prestige * 400 + overall(n) * 20),
        fee: Math.min(value(n), club.budget),
        years: 3,
        minutes: clamp(65 + (overall(n) - club.strength) * 3, 15, 95),
      }))
      .filter(
        (o) => o.club !== n.club && clubs[o.club].budget >= value(n) * 0.5,
      )
      .slice(n.week === 5 ? 0 : 2, n.week === 5 ? 3 : 5);
}
export function quickMatch(c: Career) {
  let n = c.match ? structuredClone(c) : startMatch(c);
  let guard = 0;
  while (n.match && !n.match.finished && guard++ < 100)
    n = advance(n, undefined, true);
  return n;
}
export function closeMatch(c: Career) {
  if (!c.match?.finished) return c;
  return { ...c, match: null };
}
export function transfer(c: Career, club: number) {
  const offer = c.offers.find((o) => o.club === club);
  if (!offer || c.match || c.week !== 14) return c;
  const n = structuredClone(c);
  n.transfers.push(
    `S${n.season}: ${clubs[n.club].name} → ${clubs[club].name} (${offer.fee.toLocaleString("tr-TR")} €)`,
  );
  n.club = club;
  n.salary = offer.salary;
  n.contract = offer.years;
  n.trust = offer.minutes;
  n.offers = [];
  return n;
}
export function nextSeason(c: Career) {
  if (c.week !== 14 || c.match) return c;
  const n = structuredClone(c),
    place = ranking(n).findIndex((r) => r.club === n.seasonClub) + 1;
  const trophy =
    place === 1
      ? "Ufuk Ligi şampiyonu"
      : place >= 7
        ? "Düşme hattı — gelişim ligine gönderildi"
        : "Sezon tamamlandı";
  n.history.push({
    season: n.season,
    club: n.seasonClub,
    games: n.games,
    goals: n.goals,
    assists: n.assists,
    overall: overall(n),
    place,
    trophy,
  });
  n.news.unshift(
    `Sezon ${n.season}: ${place}. sıra. ${trophy}. ${n.goals >= 8 ? "Golcü ödülü kazandın!" : ""}`,
  );
  if (place >= 7 && n.club === n.seasonClub) {
    n.club = 0;
    n.trust = 85;
    n.transfers.push(
      `S${n.season}: Düşme hattı sonrası Kıyıspor ile yeni başlangıç.`,
    );
  }
  n.seasonClub = n.club;
  n.season++;
  n.profile.age++;
  n.contract = Math.max(0, n.contract - 1);
  n.week = 0;
  n.table = table();
  n.games = 0;
  n.goals = 0;
  n.assists = 0;
  n.trained = false;
  n.energy = 100;
  n.offers = [];
  if (n.profile.age >= 40) {
    n.retired = true;
    n.news.unshift("40 yaşında kariyerini tamamladın. Geçmişin kayıtlı.");
  } else if (n.profile.age > 30) {
    for (const k of Object.keys(n.attributes) as (keyof Attributes)[])
      n.attributes[k] = Math.max(30, n.attributes[k] - 0.7);
  }
  return n;
}
